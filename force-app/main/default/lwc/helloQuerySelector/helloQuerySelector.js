import { LightningElement } from 'lwc';

export default class HelloQuerySelector extends LightningElement {
    
    userNames = ["John", "Mike", "Dave", "Terry"];
    
    fetchDetailHandler () 
    {
        const elem = this.template.querySelector('h1');
        console.log(elem.innerText);
        const userElements = this.template.querySelectorAll('.name');
        Array.from(userElements).forEach(item => {
            console.log(item.innerText);
        })
    }
}