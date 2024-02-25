@isTest
public class AccountTriggerTest {
  @isTest
  static void testAccountTrigger() {
    List<Account> accts = new List<Account>();
    for (Integer i = 0; i < 200; i++) {
      Account acc = new Account(
        Name = 'Test Account ' + i,
        BillingState = 'CA'
      );
      accts.add(acc);
    }
    Test.startTest();
    insert accts;
    Test.stopTest();
    for (Account acc : accts) {
      System.assertEquals('CA', acc.ShippingState);
    }
  }
}