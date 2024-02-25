trigger duplicateLead on Lead (after insert) {     
	if(!CheckRecursive.firstcall){
        CheckRecursive.firstcall = true;
		List<Lead> leadList = new List<Lead>();
		leadList = Trigger.new.deepClone();
		insert leadList;
    }
}