import { LightningElement } from 'lwc';
import getSummaryReportResponse from '@salesforce/apex/ReportTypes.getSummaryReportResponse';


export default class SummaryReport extends LightningElement {
    
    developerName  = 'New_Properties_with_Broker_Report_OOF';
    headerColumns;
    completeResults;
    reportFields;
    groupList;
    

    connectedCallback(){
        if (this.developerName) {
            getSummaryReportResponse({devName: this.developerName})
            .then(result => {
                this.completeResults = JSON.parse(JSON.stringify(result)); 
                console.log(this.completeResults);              

                const {groupList, reportFields} = this.completeResults;
                this.reportFields = reportFields;
                this.groupList = groupList;                             
            
            })
            .catch(error => {
                this.error = error;
                console.log(this.error);
            });
        }

    }

}