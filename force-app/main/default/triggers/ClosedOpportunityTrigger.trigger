trigger ClosedOpportunityTrigger on Opportunity (after insert, after update) {
    List<Task> taskList = new List<Task>();
    for(Opportunity oppt: Trigger.New) {
        if(oppt.StageName=='Closed Won') {
            taskList.add(new Task(Subject='Follow Up Test Task', WhatId=oppt.Id));
        }
    }
    if (!taskList.isEmpty()) {
        insert taskList;
    }   
}