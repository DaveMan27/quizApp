import { LightningElement } from 'lwc';
import getCallout from '@salesforce/apex/LastFM_UtilityClass.getCallout';


export default class ArtistCallout extends LightningElement 
{
    async calloutHandler()
    {
        try
        {
            this.result = await getCallout();
            console.log(this.result.artist[1]);
            console.log('Insert callout');
        }        
        catch(error)        
        {
            console.log(error);
        }
        
    }
}