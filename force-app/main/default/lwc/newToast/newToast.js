import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { loadStyle } from 'lightning/platformResourceLoader';
import ToastContainer from 'lightning/toastContainer';

import customCSS from '@salesforce/resourceUrl/toastCSS';

export default class ToastMessageContainer extends LightningElement {
    
    @track isCSSLoaded = false;

    renderedCallback() {

        if (this.isCSSLoaded) return;
        this.isCSSLoaded = true;
        loadStyle(this, customCSS).then(() => {
            console.log('css loaded successfully');
        }).catch(error => {
            console.log('error to load css');
        });
    }

    connectedCallback() { 
        const toastContainer = ToastContainer.instance();
        toastContainer.maxShown = 3;
        toastContainer.toastPosition = 'top-right';
    }
    
    showError() {
        
        var msg = 'First Message\nSecond Message\nThird Message';

        
        const evt = new ShowToastEvent({
            title  : 'Salesforce Toast',
            message: msg,
            variant: 'error',
            mode : 'sticky'
        });
        this.dispatchEvent(evt);
    }

    showWarning() {
        
        var msg = 'First Message\nSecond Message\nThird Message';

        
        const evt = new ShowToastEvent({
            title  : 'Salesforce Toast',
            message: msg,
            variant: 'warning',
            mode : 'sticky'
        });
        this.dispatchEvent(evt);
    }

    showSuccess() {
        
        var msg = 'First Message\nSecond Message\nThird Message';

        
        const evt = new ShowToastEvent({
            title: 'Salesforce Toast',
            message: msg,
            variant: 'success'
        });
        this.dispatchEvent(evt);
    }

    showInfo() {
        
        var msg = 'First Message\nSecond Message\nThird Message';

        const evt = new ShowToastEvent({
            title: 'Salesforce Toast',
            message: msg,
            variant: 'info'
        });
        this.dispatchEvent(evt);
    }    


    handleToastMsg() {
        var msg = 'First Message\nSecond Message\nThird Message';

        const evt = new ShowToastEvent({
            title: 'Toast Success',
            message: msg,
            variant: 'success',
            mode: 'sticky'
        });
        this.dispatchEvent(evt);
    }
    

}