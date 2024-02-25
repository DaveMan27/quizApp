trigger AccountTrigger on Account (before insert) {
	
    if(Trigger.isBefore && Trigger.isInsert) {
		AccountTriggerHandler.CreateAccounts(Trigger.new);		
	}
    
    //AccountTriggerHandler AccHandler = new AccountTriggerHandler();
    /*switch on Trigger.operationType {
            when BEFORE_INSERT {
                AccountTriggerHandler.CreateAccounts(Trigger.new);
            }
            /*when BEFORE_UPDATE {
                // AccHandler.beforeUpdate(Trigger.old, Trigger.new, Trigger.oldMap, Trigger.newMap);
            }
            when BEFORE_DELETE {
                // AccHandler.beforeDelete(Trigger.old, Trigger.oldMap);
            }
            when AFTER_INSERT {
                AccHandler.afterInsert(Trigger.new);
            }
            when AFTER_UPDATE {
                AccHandler.afterUpdate(Trigger.new, Trigger.oldMap);
            }
            when AFTER_DELETE {
                //AccHandler.afterDelete(Trigger.old, Trigger.oldMap);
            }
            when AFTER_UNDELETE {
                // AccHandler.afterUndelete(Trigger.new, Trigger.newMap);
            }*/
        
    
}