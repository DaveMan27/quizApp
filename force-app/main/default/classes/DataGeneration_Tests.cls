@isTest
private class DataGeneration_Tests {
    @testSetup
  static void dataCreation() {
    Account a = TestFactory.getAccount('Muddy Waters Inc.', true);
    Contact c = TestFactory.getContact(a.id, 'Muddy', 'Waters', true);
    Opportunity opp = New Opportunity();
    opp.name = 'Long lost record';
    opp.accountId = a.id;
    opp.closeDate = Date.today().addDays(14);
    opp.stageName = 'prospecting';
    insert opp;
  }
    @isTest
  static void testBruteForceAccountCreation() {
    List<Account> accts = new List<Account>();
    Account a = new Account(name='McTesterson LLC');
    insert a;
    Test.startTest();
      accts = [SELECT Id FROM Account];
    Test.stopTest();
    System.assert(accts.size() > 0, 'Was expecting to find at least one account');
  }
  @isTest
  static void testUseTestFactoryToCreateAccountsWithContacts() {
    List<Account> accts;
    List<Contact> contacts;
    TestFactory.generateAccountWithContacts(5);
    Test.startTest();
      accts = [SELECT Id FROM Account];
      contacts = [SELECT Id FROM Contact];
    Test.stopTest();
    System.assert(accts.size() > 0, 'Was expecting to find at least one account');
	System.assert(contacts.size() == 6, 'Was expecting to find 6 contacts');  }
	@isTest
  		static void testAtTestSetupMethodsRule() {
    	List<Opportunity> opps = [SELECT Id, AccountId FROM Opportunity];
    	System.assertEquals(1, opps.size(), 'Expected test to find a single Opp');
  }
}