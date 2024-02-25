@isTest
public class Test_Calculator {
    @isTest
    static void testAdd() {
        
        System.assertEquals(11, Calculator.addition(5,6), 'Did not perform function');     
    	
    }
    @isTest
    static void testSubtract() {
        
        System.assertEquals(11, Calculator.subtraction(15,4), 'Did not perform function');     
    	  
    }
    @isTest
    static void testMultiply() {
        System.assertEquals(30, Calculator.multiply(5,6), 'Did not perform function');     
    	
    }
    @isTest
    static void testDivide() {
        
        System.assertEquals(11, Calculator.divide(55,5), 'Did not perform function');     
    	
    }
    @isTest
 public static void divide_throws_exception_for_division_by_zero() {
 Boolean caught = false;
 try {
    Calculator.divide(1, 0);
  } catch (Calculator.CalculatorException e) {
    System.assertEquals('you still can\'t divide by zero', e.getMessage(), 
  'caught the right exception');
    caught = true;
   }
   System.assert(caught, 'threw expected exception');
   }
    
    @isTest
 public static void multiplicationByZero() {
 Boolean caught = false;
 try {
    Calculator.multiply(1, 0);
  } catch (Calculator.CalculatorException e) {
    System.assertEquals('It doesn\'t make sense to multiply by zero', e.getMessage(), 
  'caught the right exception');
    caught = true;
   }
   System.assert(caught, 'threw expected exception');
   }
    
    @isTest
 public static void returnNegative() {
 Boolean caught = false;
 try {
    Calculator.divide(-6, 1);
  } catch (Calculator.CalculatorException e) {
    System.assertEquals('Division returned a negative value.', e.getMessage(), 
  'caught the right exception');
    caught = true;
   }
   System.assert(caught, 'threw expected exception');
   }
    

}