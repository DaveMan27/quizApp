@isTest
public class TestRestrictContactByName {
    @isTest static void TestInvalid(){
       
        Contact cont = new Contact(FirstName='Dave', LastName='INVALIDNAME');
        
        Test.startTest();
        Database.SaveResult result = Database.insert(cont, false);
        Test.stopTest();
        
        System.assert(!result.isSuccess());
        
        
    }
}