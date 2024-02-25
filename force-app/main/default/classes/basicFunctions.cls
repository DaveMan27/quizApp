public class basicFunctions {
    public static void createNewAccount(){
        //Account a = new Account(Name='New Account Trigger');  
		//insert a;  
        /*List<Lead> leadList = new List<Lead>();
        Lead newLead = new Lead(FirstName='Dave', LastName='Matthews Band', Company='DMB Enterprises', Email='daveslaw@gml.com');
        leadList.add(newLead);
        insert leadList;*/
        sObject newAcc = [SELECT ID,Name FROM ACCOUNT WHERE ID='0017R00002pUZWOQA4'];
        system.debug(newAcc);
        
		
       
        //Account accName = m.get('0017R00002pCjXUQA0');
        //stem.debug(ls[0]);
		//stem.debug('Map: ' + m);
        
    }
    public static void userPermissions() {
        Id currentUserProfileId = UserInfo.getProfileId();
		List <Profile> profileName = [SELECT Name FROM Profile WHERE Id = :currentUserProfileId];
        system.debug(profileName);
    }
    
    
    

}