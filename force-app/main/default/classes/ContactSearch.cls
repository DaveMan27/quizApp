public class ContactSearch {
    public static List<Contact> searchForContacts(String firstString, String secondString){
        List<Contact> contactList = [SELECT Name 
                                     FROM Contact 
                                     WHERE LastName= :firstString AND MailingPostalCode =:secondString ];
        System.debug(contactList);
        return contactList;
    }
}