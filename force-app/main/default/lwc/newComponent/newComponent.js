import { LightningElement, track } from 'lwc';

export default class NewComponent extends LightningElement {

    fullname = 'DaveMan';
    title = 'The King';

    @track address = {
        city:"Melbourne",
        country: "Australia",
        ZIP: "1677"
    }



    changeHandler(e) {
        this.title = e.target.value;
    }

    trackHandler(e) {
        this.address.city = e.target.value;
    }

    users = ['John', 'Mary', 'Nick'];

    num1 = 10;
    num2 = 25;


    get firstUser() {
        return this.users[0]
    }

    get multiply() {
        return this.num1 * this.num2
    }

    isVisible = false;

    toggleText () {
        this.isVisible = !this.isVisible
    }



}