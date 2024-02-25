import { LightningElement } from 'lwc';

export default class C2pParentComponent extends LightningElement {

    showModal = false;

    modalToggler() {
        this.showModal = true;
    }

    closeHandler(){
        this.showModal = false;
    }

}