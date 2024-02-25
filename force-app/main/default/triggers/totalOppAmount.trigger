trigger totalOppAmount on Account (before update){
//Get the Account Id's of the List of Accounts getting updated to get its related Opportunities
Set<Id> accId=new Set<Id>();
for(Account acc:Trigger.new){
//before making changes see to that "Total Opportunity Amount" field is 0
acc.Total_Opportunity_Amount__c=0;
accId.add(acc.Id);
}
//map to get the Account Id and the sum of its related opportunities amount to insert later
Map<Id,Double> amountMap = new Map<Id,Double>();
//AggregateResult to get the sum of opportunities amount grouped by Account Id
List<AggregateResult> results=[select AccountId,sum(Amount)TotalAmount from opportunity where AccountId in :accId group by AccountId];
if(results.size()>0){
for(AggregateResult a: results){
//getting the AccountId and sum(Amount) in separate variables and putting it to map
Id accountId = (Id)a.get('AccountId');
double TotalAmount = (double)a.get('TotalAmount');
amountMap.put(accountId,TotalAmount);
}
}
//Again looping the accounts which are getting updated and making changes in "Total Opportunity Amount" field
for(Account acc:Trigger.new){
if(amountMap.containskey(acc.Id)){
acc.Total_Opportunity_Amount__c=amountMap.get(acc.Id);
}
}
}