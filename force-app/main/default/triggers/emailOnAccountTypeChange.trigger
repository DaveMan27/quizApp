trigger emailOnAccountTypeChange on Account (after update) {
	Set<Id> accId = new Set<Id>();
    for (Account a: Trigger.new){
        if(a.Type != Trigger.OldMap.get(a.id).type){
            accId.add(a.id);
        }
    }
}