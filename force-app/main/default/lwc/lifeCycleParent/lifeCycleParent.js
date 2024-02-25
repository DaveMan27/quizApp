import { LightningElement } from 'lwc';

export default class LifeCycleParent extends LightningElement {

    constructor(){
        super()
        console.log('Parent contructor called');
    }

    connectedCallback() {
        console.log('Parent connectedCallback called');
    }

    renderedCallback() {
        console.log('Parent renderedCallBack called');
    }

    errorCallback(error, stack) {
        console.log(error.message);
        console.log(stack);
    }

}