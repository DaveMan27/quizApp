import { LightningElement, track } from 'lwc';
import getReport from '@salesforce/apex/DaveReports_Test.getReport';


export default class DavesReporting extends LightningElement 
{
   developerName = 'Copy_of_New_Opportunities_Report_V06';
   headerColumns= [];
   completeData = [];
   sortedDirection = 'desc';
   sortedColumn;
   //data;
   newArray;
   
   // variables for pagination
   remainingRecords;
   totalPages;
   outputArray; 
   recordLimit = 15;
   currentPage = 1;
   disabledNext = false;
   disabledPrev = true;
   startingIndex = 0;
   showTable = true;

    





    
    connectedCallback() {
        
        
        if (this.developerName) {
            getReport({devName: this.developerName})
            .then(result => {
                
                
                
               
                this.headerColumns = result.headerColumns;
                console.log(this.headerColumns);
                
                //Make a clone of the returned data, and make sure that it is extensible. The JSON parse solution is the only one which worked
                
                this.newArray = JSON.parse(JSON.stringify(result.completeData));              
                
                
                //update the array, add different properties
                this.newArray.forEach(row => {
                    row.forEach((item, index) => {
                        let  { 
                                fieldValue, 
                                fieldLabel, 
                                isEmail, 
                                isHyperLink,
                                                              
                                

                                } = item;

                        item.dataType = this.headerColumns[index].dataType;
                        
                        switch (item.dataType){
                            
                            case 'CURRENCY_DATA':
                                item.number = this.convertToInteger(fieldLabel);
                            break;
                            
                            case 'PERCENT_DATA':
                                item.number = this.convertPercentInteger(fieldLabel);
                            break;                       
                            
                        }

                        


                        if (fieldLabel == '-')
                        {
                            item.number = 0; 
                        }

                        if (isEmail)
                        {
                            item.emailAddress = `mailto: ${fieldValue}`;
                        } 
                        
                        if (isHyperLink) 
                        {
                            item.url = `/${fieldValue}`;
                        } 
                        
                        if (!isHyperLink && !isEmail) {
                            item.status = 'regular';
                        } 
                    })
                })
                
                //initiating the output into the HTML by slicing the array
                this.totalPages = Math.ceil(this.newArray.length/this.recordLimit);
                this.remainingRecords = this.newArray.length;
                this.outputArray = this.newArray.slice(this.startingIndex, this.recordLimit);
                
                console.log(this.remainingRecords);
                console.log(this.outputArray)
                console.log(this.headerColumns);
                                     
                })
                .catch(error => {
                    this.error = error;
                    console.log(this.error);
                });
        }
        
    }

    convertToInteger (input) {
        
        let temp = input.substring(1).replace(/,/g, '');
        let outputVar = parseInt(temp, 10);
        return outputVar;                         
    }

    convertPercentInteger (input) {
        let temp = input.replace(/%/g, '');
        let outputVar = parseInt(temp, 10);
        return outputVar;
    }

    convertAmountString (input) {

        return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    }

    firstPage () {
        
        if (this.disabledNext == true){
            this.disabledNext = false;
        }

        this.currentPage = 1;
        this.startingIndex = 0;
        this.remainingRecords = this.newArray.length;
        this.outputArray = this.newArray.slice(this.startingIndex, (this.startingIndex + this.recordLimit));
    }

   
        
    handleSort (e) 
    {
        this.sortedColumn  = e.currentTarget.dataset.id;
        this.showTable = false;
        
        if (this.sortedDirection == 'asc') // if direction is asc, sort desc
        {         
            
            switch (this.headerColumns[this.sortedColumn].dataType) 
            {
                case 'CURRENCY_DATA':
                case 'PERCENT_DATA':
                    this.newArray = this.newArray.sort((a, b) => 
                         {return b[this.sortedColumn].number - a[this.sortedColumn].number});
                break;

                case 'DATE_DATA':
                    this.newArray = this.newArray.sort((a, b) => 
                        {return new Date(b[this.sortedColumn].fieldValue) - new Date(a[this.sortedColumn].fieldValue);});
                break;
                
                default: 
                    this.newArray = this.newArray.sort((a, b) => 
                        {return b[this.sortedColumn].fieldLabel.localeCompare(a[this.sortedColumn].fieldLabel)});
                break;                
            }                    
            
            this.sortedDirection = 'desc';


        } else if (this.sortedDirection == 'desc') 
        { 
            switch (this.headerColumns[this.sortedColumn].dataType) 
            {
                case 'CURRENCY_DATA':
                case 'PERCENT_DATA':
                    this.newArray = this.newArray.sort((a, b) => 
                         {return a[this.sortedColumn].number - b[this.sortedColumn].number});
                break;

                case 'DATE_DATA':
                    this.newArray = this.newArray.sort((a, b) => 
                        {return new Date(a[this.sortedColumn].fieldValue) - new Date(b[this.sortedColumn].fieldValue);});
                break;
                
                default: 
                    this.newArray = this.newArray.sort((a, b) => 
                        {return a[this.sortedColumn].fieldLabel.localeCompare(b[this.sortedColumn].fieldLabel)});
                break;                
            }
                 

            this.sortedDirection = 'asc';  
        }
        this.firstPage();
        this.showTable = true; 
        console.log('Sorting direction: ' + this.sortedDirection);
    }
    // }
                   
    // }


    nextPage(){
        // Once next page is clicked, by definition there should be a prevPage, so enabling button
                

        // the loop will only iterate as long as the currentPage is LESS than the number of totalPages. Once currentPage = totalPages, the code won't run.
        if(this.currentPage < (this.totalPages)){
            
                       
            //Initiating the change and page and the slicing positons
            this.currentPage = this.currentPage + 1;

            if (this.disabledPrev == true){
                this.disabledPrev = false;
            };  



            this.remainingRecords = this.remainingRecords - this.recordLimit ; 
            this.startingIndex = this.startingIndex + this.recordLimit;
                                          
            
            if (this.remainingRecords < this.recordLimit) {                
                this.outputArray = this.newArray.slice(this.startingIndex);                
                this.disabledNext = true;
                
            } else 
            {
                this.outputArray = this.newArray.slice(this.startingIndex, (this.startingIndex + this.recordLimit));
            }        
            
            
        } 
        
        console.log('CurrentPage: ' + this.currentPage);       

    }

    prevPage(){
       

        
        

        console.log('Prev page: ' + this.currentPage);
         
        if(this.currentPage > 1){
            if (this.disabledNext == true)
            {
                this.disabledNext = false;
            };
            
            this.currentPage = this.currentPage - 1;
            this.remainingRecords = this.remainingRecords + this.recordLimit;  
            

            this.startingIndex = this.startingIndex - this.recordLimit;
                 
            this.outputArray = this.newArray.slice(this.startingIndex, (this.startingIndex + this.recordLimit));     
            
           
            if (this.currentPage == 1) {
                this.disabledPrev = true;
            }  
                             
            
            
            console.log('CurrentPage: ' + this.currentPage);

            
        } 
        
    }

    
    
    
}





    // handleSort(e)
    // {
        
    //     console.log('sorted version 34');
       
        
    //     this.sortedColumn  = e.currentTarget.dataset.id;
        
    //     if (this.sortedDirection == 'asc') 
    //     {
    //         this.showTable = false;
            
    //         // this.outputArray = this.outputArray.sort((a, b) => 
    //         //     {return a[this.sortedColumn].fieldLabel.localeCompare(b[this.sortedColumn].fieldLabel)});
            
    //         // if (this.outputArray[this.sortedColumn][0].dataType == 'CURRENCY_DATA') {
    //         //      this.outputArray = this.outputArray.sort((a, b) => 
    //         //     {return a[this.sortedColumn].fieldLabel- b[this.sortedColumn].fieldLabel});
    //         // }

    //         switch (this.outputArray[0][this.sortedColumn].dataType) 
    //         {
    //             case 'CURRENCY_DATA':
    //                 for (let i = 0; i < this.outputArray.length; i++) {                        
    //                     if (Number.isInteger(this.outputArray[i][this.sortedColumn].fieldLabel) === false)
    //                     {
    //                         if (Number.isNaN(this.outputArray[i][this.sortedColumn].fieldLabel) == false ) {
    //                             console.log(this.outputArray[i][this.sortedColumn].fieldLabel);
    //                             const newFieldLabel = this.convertToInteger(this.outputArray[i][this.sortedColumn].fieldLabel);
    //                             //newFieldLabel = isNaN(newFieldLabel) ? '-' : newFieldLabel;
    //                                 this.outputArray[i][this.sortedColumn].fieldLabel = newFieldLabel;
                                
                                
    //                         } else {
    //                             console.log(this.outputArray[i][this.sortedColumn].fieldLabel);
    //                             this.outputArray[i][this.sortedColumn].fieldLabel = '-';
    //                         }                           
                                 
    //                     }
                                   
    //                 }
    //                 this.outputArray = this.outputArray.sort((a, b) => 
    //                  {return a[this.sortedColumn].fieldLabel- b[this.sortedColumn].fieldLabel});
    //             break;
                
    //             case 'PERCENT_DATA':
    //                 for (let i = 0; i < this.outputArray.length; i++) {                        
    //                     if (Number.isInteger(this.outputArray[i][this.sortedColumn].fieldLabel) === false)
    //                     {
                            
    //                         const newFieldLabel = this.convertPercentInteger(this.outputArray[i][this.sortedColumn].fieldLabel);
    //                         //newFieldLabel = isNaN(newFieldLabel) ? '-' : newFieldLabel;
    //                         this.outputArray[i][this.sortedColumn].fieldLabel = newFieldLabel;
    //                         console.log(this.outputArray[i][this.sortedColumn].fieldLabel);
    //                     }                        
    //                 }
    //                 this.outputArray = this.outputArray.sort((a, b) => 
    //                  {return a[this.sortedColumn].fieldLabel- b[this.sortedColumn].fieldLabel});

    //             break;

    //             default:
    //                 this.outputArray = this.outputArray.sort((a, b) => 
    //                     {return a[this.sortedColumn].fieldLabel.localeCompare(b[this.sortedColumn].fieldLabel)});
    //             break;
        
    //         }

            
    //         this.sortedDirection = 'desc';    
    //         this.showTable = true;           
            
    //     } else if (this.sortedDirection == 'desc')
    //     {
            
    //         this.showTable = false;
            
    //         // this.outputArray = this.outputArray.sort((a, b) => 
    //         //     {return b[this.sortedColumn].fieldLabel.localeCompare(a[this.sortedColumn].fieldLabel)});

    //         ccccccccccccccccccccccccccccccc 
    //         {
    //             case 'CURRENCY_DATA':
    //                 for (let i = 0; i < this.outputArray.length; i++) {       
    //                     if (Number.isInteger(this.outputArray[i][this.sortedColumn].fieldLabel) === false )
    //                     {                 
    //                         if (Number.isNaN(this.outputArray[i][this.sortedColumn].fieldLabel) == false) {
    //                             console.log(this.outputArray[i][this.sortedColumn].fieldLabel);
    //                             const newFieldLabel = this.convertToInteger(this.outputArray[i][this.sortedColumn].fieldLabel);
    //                             //newFieldLabel = isNaN(newFieldLabel) ? '-' : newFieldLabel;
    //                             this.outputArray[i][this.sortedColumn].fieldLabel = newFieldLabel;
    //                         } else {
    //                             console.log(this.outputArray[i][this.sortedColumn].fieldLabel);
    //                             this.outputArray[i][this.sortedColumn].fieldLabel = '-';
    //                         } 
                            
                            
    //                     }                        
    //                 }
    //                 this.outputArray = this.outputArray.sort((a, b) => 
    //                     {return b[this.sortedColumn].fieldLabel- a[this.sortedColumn].fieldLabel});                    
    //             break;
                
    //             case 'PERCENT_DATA':
                    
    //                 for (let i = 0; i < this.outputArray.length; i++) {                        
    //                     if (Number.isInteger(this.outputArray[i][this.sortedColumn].fieldLabel) === false)
    //                     {
    //                         const newFieldLabel = this.convertPercentInteger(this.outputArray[i][this.sortedColumn].fieldLabel);
    //                         //newFieldLabel = isNaN(newFieldLabel) ? '-' : newFieldLabel;
    //                         this.outputArray[i][this.sortedColumn].fieldLabel = newFieldLabel;
    //                         console.log(this.outputArray[i][this.sortedColumn].fieldLabel); 
    //                     } 
                                               
    //                 }
    //                 this.outputArray = this.outputArray.sort((a, b) => 
    //                     {return b[this.sortedColumn].fieldLabel - a[this.sortedColumn].fieldLabel});
    //             break;

    //             default:
    //                
    //         }
           
    //         this.sortedDirection = 'asc';            
    //         this.showTable = true;
            
    //     }