public class RandomContactFactory {
    public static List<Contact> generateRandomContacts(Integer numberOfContacts, String contactLastName) {
        List<Contact> contactList = new List<Contact>();
        for (Integer i=0; i<numberOfContacts; i++) {
            Contact generatedContact = new Contact(FirstName = 'Test ' + i, LastName = contactLastName);
            contactList.add(generatedContact);            
        }
        insert contactList;
        return contactList;
    }
}