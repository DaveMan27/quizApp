global class DaveReports_Test // with sharing
{
    public class ReportResponseWrapper
    {
        @AuraEnabled public List<fieldDef> headerColumns {get; set;}
        @AuraEnabled public List<List<fieldData>> completeData {get; set;}
        //@AuraEnabled public List<object> repFilterList {get; set;}
    }
    
    public class filterDetails 
    {
        @AuraEnabled public String fcolumn {get; set;}        
        @AuraEnabled public String fvalue {get; set;}      
    }
    
    //Wrapper for headers of report
    public class fieldDef      
    {
      @AuraEnabled public String fieldName {get; set;}
      @AuraEnabled public String fieldLabel {get; set;}
      @AuraEnabled public String dataType {get; set;}
    }
    
    //Wrapper for each field of data displayed
    public class fieldData 
    {
        @AuraEnabled public object fieldValue {get; set;}
        @AuraEnabled public String fieldLabel {get; set;}
        @AuraEnabled public String dataType  {get; set;}        
        @AuraEnabled public Boolean isHyperLink {get; set;}
        @AuraEnabled public Boolean isEmail {get; set;}
       
        public fieldData(){isHyperLink=false;}
    }
    
    private static Boolean isHyperlink(object sVal) 
    {
        Boolean isHyperLink = true;
        Id theId;
        try {theId = (Id)sVal;}
        catch (Exception e) {isHyperLink = false;}
        return isHyperLink;
    }
        //
    @AuraEnabled(cacheable=true)
    public static ReportResponseWrapper getReport(string devName, list<filterDetails> filterInput)
    {
        
        ReportResponseWrapper rrw = new ReportResponseWrapper();
        List<fieldDef> headerColumns = new List<fieldDef>();
        List<List<fieldData>> completeData = new List<List<fieldData>>();
        
        List <Report> reportList = [SELECT Id, DeveloperName FROM Report WHERE DeveloperName = :devName];
        String reportId      = (String)reportList.get(0).get('Id');
    
        
        // Call Schema to get the report metadata
        Reports.ReportMetadata reportMd = Reports.ReportManager.describeReport(reportId).getReportMetadata();     
       
	///////////////////
	//Filters
	//////////////////
        
        //Each filter being passed in as a paramter is made into an item in a Map
	  Map<string, string> filterMap = new Map<string, string>(); 
        filterInput = filterInput== null ? new list<filterDetails>() :  filterInput;
        for (filterDetails curr : filterInput)
        {
            filterMap.put(curr.fcolumn, curr.fvalue);
        }
        system.debug('filter map: ' + filterMap);
        
        //Input filters are checked against the existing filters of the report
            
        for (Reports.ReportFilter filter: reportMd.getreportFilters()) {
            string fgetColumn = filter.getColumn(); 
            
            if (fgetColumn.containsAny('.'))
            {
                List<String> parts = filter.getColumn().split('\\.'); 
                fgetColumn = parts[parts.size()-1];            
            }                        
            
            if (filterMap.containsKey(fgetColumn)) {     
                filter.setValue(filterMap.get(fgetColumn)); //If the filter exists in report, then the value of the filter is changed to the input filter                
            }
        }
           
        
       Reports.reportResults results = Reports.ReportManager.runReport(reportId, reportMd, true);
        
       ///////////////////////
       //Column Data
       //////////////////////            
       
      MAP<String,Reports.DetailColumn> headerColumnMap = results.getReportExtendedMetadata().getDetailColumnInfo();                 
               
        //loop over the columnMap and get the name, label, and data type        
        
        for (String fieldName: results.getReportMetadata().getDetailColumns()) {
            Reports.DetailColumn detailColumn = headerColumnMap.get(fieldName);
            fieldDef fd = new fieldDef();
            fd.fieldName = detailColumn.getName(); 
            fd.fieldLabel = detailColumn.getLabel();
            fd.dataType = detailColumn.getDataType().name();           
            headerColumns.add(fd);            
        }
        
        ///////////////////
        //Field data
        //////////////////
        
        for(Reports.ReportFact reportFact : results.getFactMap().values())
        {
            Reports.ReportFactWithDetails reportFactWithDetails = (Reports.ReportFactWithDetails)reportFact;            

            List<fieldData> rowData;
            for(Reports.ReportDetailRow reportDetailRow : reportFactWithDetails.getRows()) // data for a row
            {
                Integer cellCounter = 0;
                rowData = new List<fieldData>();
                
                for(Reports.ReportDataCell reportDataCell : reportDetailRow.getDataCells()) // data for each cell
                {
                    
                    if(reportDataCell.getValue() != null)
                    {                        
                      fieldData fd = new fieldData();
                  	fd.fieldValue = (object)reportDataCell.getValue();
                      if (isHyperlink(fd.fieldValue))
                      {
                         fd.isHyperlink = true;                                                       
                      }

                  	fd.fieldLabel = reportDataCell.getLabel();
                  	fd.dataType = headerColumns[cellCounter].dataType;
                  	fd.isEmail = headerColumns[cellCounter].dataType == 'EMAIL_DATA' ? true : false;
                        
                       
                        
                  	rowData.add(fd);
                    }
                    else
                    {
                        fieldData fd = new fieldData();
                        fd.fieldLabel = '-';
                        rowData.add(fd);
                    }
                    cellCounter++;                    
                } 
              completeData.add(rowData);                
            }                              
                                 
        }       

        //returning the wrapper of the headers and the cell data
        rrw.headerColumns = headerColumns;
        rrw.completeData = completeData;                      
        return rrw;
    
    } 
    
}