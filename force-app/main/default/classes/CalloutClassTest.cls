@isTest
private class CalloutClassTest {
     @isTest static void testCallout() {         
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());       
        HttpResponse res = CalloutClass.getInfoFromExternalService();               
        String contentType = res.getHeader('Content-Type');
        System.assert(contentType == 'application/json');
        String actualValue = res.getBody();
        String expectedValue = '{"example":"test"}';
        System.assertEquals(actualValue, expectedValue);
        System.assertEquals(200, res.getStatusCode());
    }
}