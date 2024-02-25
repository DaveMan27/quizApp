@isTest
public class TestQueueable_Test {
    //public string serializedObject;

    
    
    public class HttpCalloutMockSuccessOKResponse implements HttpCalloutMock {
        public HTTPResponse respond(HTTPRequest req) {
                HTTPResponse res = new HTTPResponse();
        		res.setHeader('Content-Type', 'application/json');
        		res.setBody('{"example":"test"}');
                res.setStatusCode(200);
                res.setStatus('OK');
                return res;
        }

    }
    
    


    @testSetup
        public static void setup()
        {
            
            List<Account> accList = new List<Account>();             
            
            for(integer counter = 0; counter < 10; counter++){
                Account acc = new Account(Name='Test Acc ' + counter);
                accList.add(acc);
            }             
            insert accList;                       
        }
    
        static testmethod void test_Queueable(){
           // Account accnt = new Accoount(Name = 'TestAcc');
            
            
            Test.setMock(HttpCalloutMock.class, new HttpCalloutMockSuccessOKResponse());
      		Test.startTest();   
          		//Account newAcc = new Account(Name = 'New Account');
            	//insert newAcc;
      		Test.stopTest();
            
            //System.assertEquals('{"example":"test"}',res.getBody());
        }
    
         static testmethod void test_Logger(){
             Test.startTest(); 
                ApexDebugLog.Log newLog = new ApexDebugLog.Log();
            	newLog.Type = 'Error';
                newLog.Method = 'Routine';
            	newLog.RecordId = null;
            	newLog.Message = 'Exception';
             
                ApexDebugLog al = new ApexDebugLog();
             	al.createLog(newLog);
             Test.stopTest();
         }
        
}