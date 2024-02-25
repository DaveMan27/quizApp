public class LastFM_UtilityClass {
	
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getCallout ()
    {
        HttpRequest req = new HttpRequest();
		req.setEndpoint('https://ws.audioscrobbler.com/2.0/?method=library.getartists&api_key=92a26c494da30fac5f6b412b5ee4a664&user=dave_lawrence85&format=json');
		req.setMethod('GET');

		Http http = new Http();
		HttpResponse res = http.send(req);
		string responseBody;
		if (res.getStatusCode() == 200) 
    	{
            responseBody = res.getBody();
            system.debug(res.getBody());
		} else 
    	{
            system.debug('unsuccessful callout');
		}
        
        Map<String, Object> m = (Map<String, Object>)JSON.deserializeUntyped(responseBody);
        system.debug(m);
        return m;
    }
    
}