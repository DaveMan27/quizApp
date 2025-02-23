global class ApexDebugLog{
    
    //    A Virtual Class that Defines the structure of a Log
    
    public virtual class Log{
        public String Type;
        public String ApexClass;
        public String Method;

        public String RecordId;
        public String Message;
        public String StackTrace;
    }
    
    /*
        A Class that Extends the Virtual Class - Log
        to define a log of type - Error
    
    public class Error extends Log{
        public Error(String cls, String routine, String recId, Exception ex){
            this.Type = 'Error';
            this.ApexClass = cls;
            this.Method = routine;
            this.RecordId = recId;
            this.Message = ex.getMessage();
            this.StackTrace = ex.getStackTraceString();
        }
    }*/

    /*
        A Class that Extends the Virtual Class - Log
        to define a log of type - Information
    
    public class Information extends Log{
        public Information(String cls, String routine, String recId, String msg){
            this.Type = 'Information';
            this.ApexClass = cls;
            this.Method = routine;
            this.RecordId = recId;
            this.Message = msg;
            this.StackTrace = NULL;
        }
    }*/

    /*
        A Public Method that can be utilized by
        other Apex Classes to create a record into
        the Apex Debug Log object stating the Error
        or Information.
    */
    public void createLog(Log logToCreate){
        try{
            system.debug('LOGGER');
            /*
                Ensure that we're well within the Governor Limits.
                The creation of the Log shouldn't disturb the execution
                of that Apex Class that utilizes this method to
                create a log.
            */
            if(
                (Limits.getDMLRows() < Limits.getLimitDMLRows()) && 
                (Limits.getDMLStatements() < Limits.getLimitDMLStatements())
            )
            {
                Apex_Debug_Log__c apexDebuglog = new Apex_Debug_Log__c(
                    Type__c         = logToCreate.Type,
                    Apex_Class__c   = logToCreate.ApexClass,
                    Method__c       = logToCreate.Method,
                    Record_Id__c    = logToCreate.RecordId,
                    Message__c      = logToCreate.Message,
                    Stack_Trace__c  = logToCreate.StackTrace
                );
				
                List<Apex_Debug_Log__c> adlList = new list<Apex_Debug_Log__c>();
                adlList.add(apexDebuglog);
                
                Database.SaveResult[] MySaveResult = Database.Insert(adlList, false);
                for(Database.SaveResult sr:MySaveResult){
                    if(!sr.isSuccess()) {
                      Database.Error err = sr.getErrors()[0];
                      system.debug('Error: ' + err);
                    }
                }
            }
            else{
                System.debug('The Governor Limits have already been exhausted and hence failed to create a Log!');
            }
        }
        catch(DMLException ex){
            System.debug('Something fatal has occurred and hence failed to create a Log! Error:' + ex.getMessage());
        }
    }

    /*
        A Public Method that can be utilized from
        JavaScript to create record(s) [aka Logs] into the
        Custom Object.
    */
    webService
    static void createLog(String log){
        try{
            /*
                Expects a JSON of the form - 
                {
                    "Type"       : "---",
                    "ApexClass"  : "---",
                    "Method"     : "---",
                    "RecordId"   : "---",
                    "Message"    : "---",
                    "StackTrace" : "---",
                }
            */

            /*Deserialize the same to create an instance of the virtual class - ApexDebugLog.Log*/
            ApexDebugLog.Log logToCreate = (ApexDebugLog.Log)JSON.deserialize(log, ApexDebugLog.Log.class);
            
            new ApexDebugLog().createLog(logToCreate);
        }
        catch(Exception ex){
            System.debug('Something fatal has occurred and hence failed to create a Log! Error:' + ex.getMessage());
        }
    }
}