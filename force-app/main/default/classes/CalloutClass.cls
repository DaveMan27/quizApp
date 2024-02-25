public class CalloutClass {
    public static HttpResponse getInfoFromExternalService() {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://postman-echo.com/post');
        req.setMethod('POST');
        Http h = new Http();
        HttpResponse res = h.send(req);
        return res;
    }
}