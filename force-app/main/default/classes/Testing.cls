public class Testing {
    public static void updateOlderAccounts() { 
        List<String> moreColors = new List<String>();
			moreColors.add('orange');
			moreColors.add('purple');
        	moreColors.add('green');
        String color1 = moreColors.get(0);
String color2 = moreColors[0];
System.assertEquals(color1, color2);
// Iterate over a list to read elements
for(Integer i=0;i<moreColors.size();i++) {
    // Write value to the debug log
    System.debug(moreColors[i]);
}
        
    }
}