public class TestQueueableFinalizer implements Finalizer {
    
    /*public string serializedObject;

    public TestQueueable(String serializedObject) {
        this.serializedObject = serializedObject;
    }*/
    
	public void execute(FinalizerContext context) 
    {        
    	id jobId = context.getAsyncApexJobId();
        System.debug('####### Executing finalizer for queuable job id: ' + jobId);
        
        if (context.getResult() == ParentJobResult.SUCCESS) 
        {
            System.debug('####### Parent queueable job ' + jobId + ' completed successfully.');
        } else 
        {
            System.debug('####### Parent queueable job ' + jobId + ' failed due to unhandled exception: ' + context.getException().getMessage());
            //String newJobId = '' + System.enqueueJob(new TestQueueable());          
            System.debug('Enqueueing another instance of the queueable...');
        }
        System.debug('Completed: execution of finalizer attached to queueable job: ' + jobId);
          
    }
}