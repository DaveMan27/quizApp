public class TestQueueable implements Queueable, Database.AllowsCallouts {
    public string serializedObject;

    public TestQueueable(String serializedObject) {
        this.serializedObject = serializedObject;
    }
    
    

    public void execute(System.QueueableContext context)   {          
        
        
            	
        
        String jobId = '' + context.getJobId();
        
         ApexDebugLog.Log newDebugLog = new ApexDebugLog.Log();
            	newDebugLog.Type = 'Information';
                newDebugLog.Method = 'Routine';
            	newDebugLog.RecordId = jobId;
            	newDebugLog.Message = 'Process completed successfully until call out'; 
            
             ApexDebugLog dll = new ApexDebugLog();
             dll.createLog(newDebugLog);
        
        System.debug('Begin: executing queueable job: ' + jobId);
        try
        {
            
           
            
            
            TestQueueableFinalizer f = new TestQueueableFinalizer();
            System.attachFinalizer(f);            
            system.debug('serialized object: ' + serializedObject);
            
            HttpRequest req = new HttpRequest(); 
            req.setEndpoint('https://postman-echo.com/post'); 
            req.setMethod('POST'); 
            req.setHeader('Accept-Encoding', 'gzip,deflate');
            req.setHeader('content-type', 'text/xml; charset=utf-8');
            req.setHeader('Content-Length', String.valueOf(serializedObject.length()));
            req.setBody(serializedObject);
    
            
            Http http = new Http(); 
            HttpResponse resp = http.send(req); String html = resp.getBody(); 
            System.debug('Request: ' + req.toString()); System.debug('Body: ' + html);
            
            
            ApexDebugLog.Log newLog = new ApexDebugLog.Log();
            	newLog.Type = 'Information';
                newLog.Method = 'Routine';
            	newLog.RecordId = jobId;
            	newLog.Message = 'This post request was successful'; 
            
             ApexDebugLog al = new ApexDebugLog();
             al.createLog(newLog);
            
            //system.debug('########### This is the new log:' + newLog +' ##########');
        }
        catch(Exception e)
        {
          ApexDebugLog.Log newLog = new ApexDebugLog.Log();
            	newLog.Type = 'Error';
                newLog.Method = 'Routine';
            	newLog.RecordId = jobId;
            	newLog.Message = e.getMessage(); 
            system.debug('########### This is the new log:' + newLog +' ##########');
            
        }
        finally
        {
            System.debug('Completed: execution of queueable job: ' + jobId);
        }                  
        
    }   
    
}