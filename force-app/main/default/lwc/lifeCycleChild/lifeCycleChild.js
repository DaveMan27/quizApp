import { LightningElement } from 'lwc';

export default class LifeCycleChild extends LightningElement {

    constructor(){
        super()
        console.log('Child contructor called');
    }

    connectedCallback() {
        console.log('Child connectedCallback called');
        throw new Error('Loading of child component failed');

    }

    renderedCallback() {
        console.log('Child renderedCallBack called');
    }

}