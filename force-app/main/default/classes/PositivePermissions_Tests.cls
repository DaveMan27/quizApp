@isTest
private class PositivePermissions_Tests {
  @testSetup
  static void testSetup(){
    Account a = TestFactory.getAccount('No view For You!', true);
    Private_Object__c po = new Private_Object__c(account__c = a.id, notes__c = 'foo');
    insert po;
  }
  @isTest
  static void PermissionSetTest_Negative() {
    User u = new User(
      ProfileId = [SELECT Id FROM Profile WHERE Name = 'Custom User'].Id,
      LastName = 'Lawrence',
      Email = 'Cpt.Awesome@awesomesauce.com',
      UserName = 'Cpt.Awesome.' + DateTime.now().getTime() + '@awesomesauce.com',
      Alias = 'alias',
      TimeZoneSidKey = 'America/Los_Angeles',
      EmailEncodingKey = 'UTF-8',
      LanguageLocaleKey = 'en_US',
      LocaleSidKey = 'en_US'
    );
    System.runAs(u){
      Private_Object__c[] pos;
      Test.startTest();
        pos = [SELECT Id, Account__c, notes__c FROM Private_Object__c];
      Test.stopTest();
      system.assert(pos.size() == 0, 'a user without the permission set cannot see any records');
    }
  }
}