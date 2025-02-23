trigger sendEmailWithPdf on Lead (after insert) {
    List<Messaging.SingleEmailMessage> emailList= new List<Messaging.SingleEmailMessage>();
    /*On App Launcher search for Email Template then Create a new Email Template with Name="Pdf Attached Email for Lead", Subject="Welcome", Body= "Please find the attached PDF." and Related Entity type= Lead and Save it.
    Later go to its related tab and add the file which u want to attach to the mail.
    Note : When u send single mail the actual file will be send.
    But if u send a list of mails then the files will be send in the
    link format where if they click on that link then the file opens.*/
    EmailTemplate emailTemplate = [Select Id,Subject,Description,HtmlValue,DeveloperName,Body 
                                   from EmailTemplate 
                                   where name='Pdf Attached Email for Lead'];
    for(Lead lObj:Trigger.new){
        if(lObj.Email!=null){
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            mail.setTargetObjectId(lObj.Id);
            mail.setSenderDisplayName('System Administrator');
            mail.setUseSignature(false);
            mail.setBccSender(false);
            mail.setSaveAsActivity(false);
            mail.setTemplateID(emailTemplate.Id);
            mail.toAddresses = new String[]{lObj.Email};
            emailList.add(mail);
        }
    }
    
    if(emailList.size()>0){
    Messaging.SendEmailResult[] results = Messaging.sendEmail(emailList);
    if (results[0].success)
    {
    System.debug('The email was sent successfully.');
    } else {
    System.debug('The email failed to send: '+ results[0].errors[0].message);
    }
    }
    }