public class ContactAndLeadSearch {
    public static List<List< sObject>> searchContactsAndLeads(String inputString) {
        List<List<sObject>> searchList = [FIND :inputString IN ALL FIELDS
                    RETURNING Contact(FirstName, LastName), Lead(FirstName,LastName)];
        System.debug(searchList);
        return searchList;
    }

}