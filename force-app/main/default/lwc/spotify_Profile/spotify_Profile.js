import { LightningElement, track } from 'lwc';
import getUserProfile from '@salesforce/apex/Spotify_lwcController.getUserProfile';
import getUserPlaylists from '@salesforce/apex/Spotify_lwcController.getUserPlaylists';
//import openPlaylist from '@salesforce/apex/Spotify_lwcController.openPlaylist';
import getPlaylistTracks from '@salesforce/apex/Spotify_lwcController.getPlaylistTracks';
import getTrackAudioAnalysis from '@salesforce/apex/Spotify_lwcController.getTrackAudioAnalysis';
import getMultiTrackAudioFeatures from '@salesforce/apex/Spotify_lwcController.getMultiTrackAudioFeatures';

export default class Spotify_Profile extends LightningElement {

           userProfile             = {};             // Stores user profile information
           //userPlaylists           = {};             // Stores user playlists information
    @track simplifiedPlaylistArray = [];             // Tracks changes to the playlist array for reactivity
           showPlaylists           = false;          // Controls the visibility of playlist UI section
           showTracks              = false;          // Controls the visibility of tracks UI section
    @track simplifiedTrackArray    = [];             // Tracks changes to the track array for reactivity
           trackIds                = '';             // Stores track IDs for re-use in audio analysis callout
           username                = 'daveslaw-us';  // Stores username for re-use in API callouts    
           multiTrackAnalysisArray = [];             // Stores multi-track audio analysis data for reactivity
           showVisualization       = false;
           trackIDs                = '';
           instrumentalArray       = [];
           keyFeatures             = [];
           keyTempoArray           = [];
           comboBoxPlaylistArray   = [];    
           columns                 = [
        { label: 'Name', fieldName: 'name' },
        { label: 'Link', fieldName: 'link', type: 'url' }
    ];    
    value = 'inProgress';


    get options() {
        return this.comboBoxPlaylistArray;
    }

    async connectedCallback() {
        await this.handleComboboxPlaylist();
        console.log('ComboBox array: ', this.comboBoxPlaylistArray);
    }

    async handleComboboxPlaylist() {
        try {
            let userPlaylists = await getUserPlaylists({ username: this.username });
            userPlaylists = JSON.parse(userPlaylists);
            this.comboBoxPlaylistArray = userPlaylists.items.map(({ name, id }) => ({ label: name, value: id }));

        } catch (error) {
            console.error('Error getting user profile', error);
        }

        return this.comboBoxPlaylistArray;
    }

    async handleComboBoxChange(event) {
              this.multiTrackAnalysisArray = [];
              this.showTracks              = false;
        const itemId                       = event.detail.value;
        console.log(`Clicked item ID: ${itemId}`);
        try {
            let tracksList = await getPlaylistTracks({ playListID: itemId });
            tracksList = JSON.parse(tracksList);
            console.log('Tracks list: ', tracksList);
            
            if (tracksList.items.length > 0) {
                this.trackIDs = tracksList.items.map((item) => item.track.id).join(',');            
                console.log(`Track IDs: ${this.trackIDs}`);
                let trackFeatures = await getMultiTrackAudioFeatures({ trackIDs: this.trackIDs });
                trackFeatures = JSON.parse(trackFeatures);
                console.log('Track features: ', trackFeatures);            
                this.simplifiedTrackArray = this.loadSimplifiedTrackArray(tracksList);
                console.log('Simplified track Array: ', JSON.parse(JSON.stringify(this.simplifiedTrackArray)));
            }
        } catch (error) {
            console.error('Error getting user profile', error);
        }
    }

    // Fetch and process user profile data
    async handleGetProfile() {
        try {
            this.userProfile = await getUserProfile({ username: this.username});
            this.userProfile = JSON.parse(this.userProfile);
            console.log(this.userProfile);
        } catch (error) {
            console.error('Error getting user profile', error);
        }
    }

    // Fetch and process user playlists
    /*async handleGetPlaylists() {
        try {
            this.userPlaylists = await getUserPlaylists({ username: this.username});
            this.userPlaylists = JSON.parse(this.userPlaylists);
            console.log(this.userPlaylists);
        } catch (error) {
            console.error('Error getting user profile', error);
        }

        this.handlePlaylistArray();
        if (this.simplifiedPlaylistArray.length > 0)            
            this.showPlaylists = true;
    }*/

    
        

    handleShowVisualization() {
        this.showVisualization = !this.showVisualization;
        // let trackFeatures = await getMultiTrackAudioFeatures({ trackIDs: this.trackIDs });
        //     trackFeatures = JSON.parse(trackFeatures);
        // console.log('Track features: ', trackFeatures);
     
        // this.keyTempoArray = this.createKeyTempArray(trackFeatures.audio_features);
        // console.log('Key features: ', this.keyFeatures);
        // console.log('Instrumental array: ', this.instrumentalArray);
        // console.log('Key tempo array: ', this.keyTempoArray);
        //console.log('Show visualization: ', this.showVisualization);
    }

    /*
        Functions to process data for visualisations  
    */

    loadIntstrumentalData(trackFeatures) {
        let instrumentalData = trackFeatures.audio_features.map(({ instrumentalness, id }) => ({ instrumentalness, id }));
        console.log('Instrumental data: ', instrumentalData);
        this.instrumentalArray = this.generateFrequencyArray(instrumentalData, 'instrumentalness');
        console.log('Instrumental array: ', this.instrumentalArray);
    }

    loadKeyData(trackFeatures) {
        let keyData = trackFeatures.audio_features.map(({ key, id }) => ({ key, id }));
        console.log('Key data: ', keyData);
        this.keyFeatures = this.generateFrequencyArray(keyData, 'key');
        console.log('Key features: ', this.keyFeatures);
    }

    loadSimplifiedTrackArray(tracksList) {
        let trackArray = tracksList.items.map(({ track }) => {
            const { name, artists, album, id, external_urls: { spotify: external_link }, href } = track;
            const artistNames = artists.map(artist => artist.name);
            const artists_nonArray = artistNames.join(', ');
            return {
                name,
                artists: artistNames,
                artists_nonArray,
                album: album.name,
                id,
                external_link,
                href
            };
        });

        return trackArray;

    }



    // Process playlists data to simplify and prepare for display
    handlePlaylistArray() {
        this.simplifiedPlaylistArray = this.userPlaylists.items.map(({ href, name, id, images }) => ({
            link: href,
            name,
            id,
            image: images.length > 0 ? images[0].url : 'defaultImageUrl' // Assuming 'defaultImageUrl' is a placeholder you have for playlists without an image
          }));
          
          console.log(JSON.parse(JSON.stringify(this.simplifiedPlaylistArray)));
    }

    /*async handlePlaylistSelect(event) {
        this.multiTrackAnalysisArray = [];
        this.showTracks = false;
        const itemId = event.detail;
        console.log(`Clicked item ID: ${itemId}`);
        try {
            /*let playlist = await openPlaylist({ playListID: itemId });
                playlist = JSON.parse(playlist);            
            console.log('Opening playlist: ', playlist);
            let tracksList = await getPlaylistTracks({ playListID: itemId });
            tracksList = JSON.parse(tracksList);
            console.log('Tracks list: ', tracksList);
            this.trackIDs   = tracksList.items.map((item) => item.track.id).join(',');
            console.log(`Track IDs: ${this.trackIDs}`);
            
            console.log('Tracks: ', tracksList);
            if (tracksList.total > 0) {
                this.simplifiedTrackArray = tracksList.items.map(({ track }) => {
                    const { name, artists, album, id, external_urls: { spotify: external_link }, href } = track;
  // Combine the artist names in a single iteration
                    const artistNames = artists.map(artist => artist.name);                    
                    const artists_nonArray = artistNames.join(', ');
                    return {
                        name,
                        artists: artistNames,
                        artists_nonArray,
                        album: album.name,
                        id,
                        external_link,
                        href
                    };
                });
                                                                
                this.showTracks = true;
                console.log(JSON.parse(JSON.stringify(this.simplifiedTrackArray)));
                this.generateAudioAnalysisArray(tracksList);
                console.log('Multi item analysis array: ', this.multiTrackAnalysisArray);
            }
            console.log('Tracks: ', tracksList);
        } catch (error) {
            console.error('Error getting user profile', error);
        }
    }*/

    async handleTrackSelect(event) {
        const trackId = event.detail;
        console.log(`Clicked track ID: ${trackId}`);
        try {
            let trackAnalysis = await getTrackAudioAnalysis({ trackID: trackId });
            trackAnalysis = JSON.parse(trackAnalysis);
            console.log('Track analysis: ', trackAnalysis);
        }
        catch (error) {
            console.error('Error getting user profile', error);
        }
    }

    generateAudioAnalysisArray(tracksList) {
        tracksList.items.forEach(item => {
            getTrackAudioAnalysis({ trackID: item.track.id })
               .then(trackAnalysis => {
                   trackAnalysis = JSON.parse(trackAnalysis);
                   this.multiTrackAnalysisArray.push(trackAnalysis);                             
                })
               .catch(error => {
                    console.error('Error getting track analysis', error);
                })
        })
        console.log('Working function');
    }

    generateFrequencyArray(audioFeatures, propertyName) {
        // Define the mapping from integers to musical notations only if needed
        const keyMapping = propertyName === 'key' ? {
            0: 'C', 1: 'C#/Db', 2: 'D', 3: 'D#/Eb', 4: 'E', 5: 'F',
            6: 'F#/Gb', 7: 'G', 8: 'G#/Ab', 9: 'A', 10: 'A#/Bb', 11: 'B'
        } : null;
    
        // Count the frequency of each property value
        const frequency = audioFeatures.reduce((acc, feature) => {
            const value = keyMapping ? keyMapping[feature[propertyName]] : feature[propertyName];
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {});
    
        // Convert the frequency object into an array of objects with 'key' and 'frequency'
        const frequencyArray = Object.entries(frequency).map(([key, freq]) => ({
            [propertyName]: key, // Use computed property name here
            frequency: freq
        }));
    
        // Convert the array to a JSON string
        return JSON.stringify(frequencyArray, null, 2);
    }

    createKeyTempArray(audioFeatures) {
        return audioFeatures.map(({ key, tempo }) => ({ key, tempo }));
    }
    
    
    
    
}


