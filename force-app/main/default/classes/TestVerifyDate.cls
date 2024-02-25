@isTest 
public class TestVerifyDate {       
    static testMethod void dateWithin() {         
        Date returnDate1 = verifyDate.CheckDates(date.valueOf('2022-02-14'),date.valueOf('2022-02-24'));         
        System.assertEquals(date.valueOf('2022-02-24'), returnDate1);           
    }      
    static testMethod void dateNotWithin() {         
        Date returnDate2 = verifyDate.CheckDates(date.valueOf('2022-02-14'),date.valueOf('2022-03-24'));         
        System.assertEquals(date.valueOf('2022-02-28'), returnDate2);             
    } 
}