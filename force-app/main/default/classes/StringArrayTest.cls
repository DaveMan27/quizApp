public class StringArrayTest {
    public static String[] generateStringArray(Integer counter) {
        String[] stringArray = new List<String>();
        for (Integer i = 0; i < counter; i ++) {
            stringArray.add('Test ' + i);
        }
        system.debug(stringArray);
        return stringArray;
    }
	
}