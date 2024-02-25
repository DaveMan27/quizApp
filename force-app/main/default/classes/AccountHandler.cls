public class AccountHandler {
    public static Account insertNewAccount(String acctName) {
        try{ Account acct = new Account(Name= acctName);
	insert acct;
        return acct;
           } catch (DMLException exc){
               System.debug('DML Exception occured.' +exc.getMessage());
               return null;
           }
    }
}