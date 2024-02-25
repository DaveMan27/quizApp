import { LightningElement } from 'lwc';
import getCallout from '@salesforce/apex/LastFM_UtilityClass.getCallout'; 

export default class CalloutComponent extends LightningElement 
{
    async calloutHandler()
    {
        try
        {
            this.result = await getCallout();
            console.log(this.result);
        }

        catch (error)
        {
            console.log(error);
        }
    }
}