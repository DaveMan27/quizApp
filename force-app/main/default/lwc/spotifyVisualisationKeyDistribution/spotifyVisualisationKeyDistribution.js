import { LightningElement, api } from 'lwc';

export default class SpotifyVisualisationKeyDistribution extends LightningElement {
    @api analysis = [];
    connectedCallback() {
        console.log('Analysis: ', this.analysis);
    }

}