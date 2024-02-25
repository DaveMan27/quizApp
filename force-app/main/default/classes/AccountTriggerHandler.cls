public class AccountTriggerHandler {
    
    
    public static void CreateAccounts (List<Account> newAccList)
    {
        List<Account> newAccs = new List<Account>();
        
        for (Account acc: newAccList)
        {
			acc.BillingState = acc.ShippingState; 
            newAccs.add(acc);
        }
        
        insert newAccs;
    }
}