trigger updateCloseLost on Account (after update) {
    List<Id> idList = new List<Id>();
    for (Account a : Trigger.new){
        idList.add(a.Id);
    }
    DateTime day30 = system.now()-30;
    List <Opportunity> oppList = [SELECT Id, AccountId, StageName, CreatedDate, CloseDate from Opportunity 
                                  WHERE AccountId in :idList 
                                  AND StageName != 'Closed won'
                                  AND CreatedDate < :day30];
    for (Opportunity opp : oppList) {
        opp.StageName = 'Closed Lost';       
    }
if(oppList.size()>0){
	update oppList;
}
        
       

}