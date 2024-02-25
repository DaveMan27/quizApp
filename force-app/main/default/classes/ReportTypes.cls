global class ReportTypes {
    
    public class summaryReportResponse 
    {
        @AuraEnabled public List<fieldDef> reportFields {get; set;}
        @AuraEnabled public List<summaryReportGroup> groupList {get; set;}
        public summaryReportResponse(){}
	}
    
    public class fieldDef 
    {
        @AuraEnabled public String fieldName {get; set;}
        @AuraEnabled public String fieldLabel {get; set;}
        @AuraEnabled public String dataType {get; set;}
        public fieldDef(){}
	}

    public class fieldData 
    {
        @AuraEnabled public Object fieldValue {get; set;}
        @AuraEnabled public String fieldLabel {get; set;}
        @AuraEnabled public String dataType  {get; set;}
        @AuraEnabled public Boolean isHyperLink {get; set;}          
        public fieldData(){isHyperLink=false;}
    }

    public class summaryReportGroup 
    {
        @AuraEnabled public String fieldName {get; set;}
        @AuraEnabled public Object fieldValue {get; set;}
        @AuraEnabled public String fieldLabel {get; set;}
        @AuraEnabled public String groupKey {get; set;}
        @AuraEnabled public Boolean isHyperLink {get; set;}	
        @AuraEnabled public Integer fieldsInGroup {get; set;}					
        @AuraEnabled public List<List<fieldData>> fieldDataList {get; set;}
        public summaryReportGroup(){}
    }
    

    
        @AuraEnabled(cacheable=true)
    public static summaryReportResponse getSummaryReportResponse(string devName) {
	summaryReportResponse srr = new summaryReportResponse();
	List<fieldDef> reportFields = new List<fieldDef>();	
        
        
    List <Report> reportList = [SELECT Id,DeveloperName FROM Report where 
            DeveloperName = :devName];
        String reportId = (String)reportList.get(0).get('Id');
        
        // Run a report
        Reports.ReportResults results = Reports.ReportManager.runReport(reportId, true);

	//get the metadata`
	Reports.ReportMetadata reportMetadata = results.getReportMetadata();

	//get a string array of the field names
	List<string> fieldNames = reportMetadata.getDetailColumns();		

	//get the extended metadata
	Reports.ReportExtendedMetadata reportExtendedMetadata = results.getReportExtendedMetadata();

	//get the map of the column names to their name and label
	Map<String, Reports.DetailColumn> detailColumnMap = reportExtendedMetadata.getDetailColumnInfo();

	//get the map of the grouping column names to their name and label
	Map<String, Reports.GroupingColumn> groupingColumnMap = reportExtendedMetadata.getGroupingColumnInfo();		

	//get the grouping column info
	Reports.GroupingInfo groupingInfo = reportMetadata.getGroupingsDown()[0]; //only supports one grouping level
	Reports.GroupingColumn groupingColumnDetail = groupingColumnMap.get(groupingInfo.getName());				

	//loop over the detailColumnMap and get the name, label, and data type
	for (String fieldName: fieldNames) {
		Reports.DetailColumn detailColumn = detailColumnMap.get(fieldName);
		fieldDef fd = new fieldDef();
		fd.fieldName = detailColumn.getName(); 
		fd.fieldLabel = detailColumn.getLabel();
		fd.dataType = detailColumn.getDataType().name();
		reportFields.add(fd);
	}
	srr.reportFields = reportFields;
        system.debug('Report fields: ' + reportFields);

	//get the summary grouping down dimension grouping values.  only going 1 level deep
	List<summaryReportGroup> groupList = new List<summaryReportGroup>();
	for (Reports.GroupingValue groupingValue: results.getGroupingsDown().getGroupings()) {
		summaryReportGroup srg = new summaryReportGroup();
		srg.fieldName = groupingColumnDetail.getLabel();			
		srg.fieldValue = (String)groupingValue.getValue();
		srg.fieldLabel = groupingValue.getLabel();
		srg.groupKey = groupingValue.getKey();
		//srg.isHyperLink = isHyperlink(srg.fieldValue);

		//use our group key to get the group rows from the fact map
		Reports.ReportFactWithDetails factDetails = (Reports.ReportFactWithDetails)results.getFactMap().get(srg.groupKey+'!T');	

        system.debug(factDetails);
		List<Reports.ReportDetailRow> reportDetailRowList = factDetails.getRows();			
	//system.debug(reportDetailRowList);
		List<List<fieldData>> fieldDataList = new List<List<fieldData>>();

		//loop over the rows
		for (Reports.ReportDetailRow reportDetailRow: reportDetailRowList) {
			Integer cellCounter = 0;
			List<fieldData> fieldDataRow = new List<fieldData>();
			//loop over the cells in the row
			for (Reports.ReportDataCell reportDataCell: reportDetailRow.getDataCells()) {
				fieldData fd = new fieldData();
				fd.fieldValue = (object)reportDataCell.getValue();
				fd.fieldLabel = (String)reportDataCell.getLabel();
				fd.dataType = reportFields[cellCounter].dataType;
				//fd.isHyperLink = isHyperlink(fd.fieldValue);
				cellCounter++;
				fieldDataRow.add(fd);
			}
	
			//add the row to the list
			fieldDataList.add(fieldDataRow);
		}			
					
		srg.fieldDataList = fieldDataList;
		groupList.add(srg);
        srg.fieldsInGroup = srr.reportFields.size();
        system.debug('SRG: ' + srg);
	}
	srr.groupList = groupList;
	system.debug('Grouplist: ' + groupList);

	return srr;
} 
    
    
    
    
    
    
    public static void getReportType(string devName) {
            // Get the report ID
        List <Report> reportList = [SELECT Id,DeveloperName FROM Report where 
            DeveloperName = :devName];
        String reportId = (String)reportList.get(0).get('Id');
        
        // Run a report
        Reports.ReportResults results = Reports.ReportManager.runReport(reportId);

        
        // Get the report metadata
        Reports.ReportMetadata rm = results.getReportMetadata();
        System.debug('Name: ' + rm.getName());
        System.debug('ID: ' + rm.getId());
        System.debug('Currency code: ' + rm.getCurrencyCode());
        System.debug('Developer name: ' + rm.getDeveloperName());
        
        // Get grouping info for first grouping
        Reports.GroupingInfo gInfo = rm.getGroupingsDown()[1];
        System.debug('Grouping name: ' + gInfo.getName());
        System.debug('Grouping sort order: ' + gInfo.getSortOrder());
        System.debug('Grouping date granularity: ' + gInfo.getDateGranularity());
        
        // Get aggregates
        System.debug('First aggregate: ' + rm.getAggregates()[0]);
        System.debug('Second aggregate: ' + rm.getAggregates()[1]);
        
        // Get detail columns
        System.debug('Detail columns: ' + rm.getDetailColumns());
        
        // Get report format
        System.debug('Report format: ' + rm.getReportFormat());
    }
}