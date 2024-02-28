import { LightningElement, track } from 'lwc';
import getUserProfile from '@salesforce/apex/Spotify_lwcController.getUserProfile';
import getUserPlaylists from '@salesforce/apex/Spotify_lwcController.getUserPlaylists';
import openPlaylist from '@salesforce/apex/Spotify_lwcController.openPlaylist';
import getPlaylistTracks from '@salesforce/apex/Spotify_lwcController.getPlaylistTracks';
import getTrackAudioAnalysis from '@salesforce/apex/Spotify_lwcController.getTrackAudioAnalysis';
import getMultiTrackAudioFeatures from '@salesforce/apex/Spotify_lwcController.getMultiTrackAudioFeatures';

export default class Spotify_Profile extends LightningElement {

    userProfile = {};     // Stores user profile information
    userPlaylists = {};     // Stores user playlists information
    @track simplifiedPlaylistArray = [];     // Tracks changes to the playlist array for reactivity
    showPlaylists = false;  // Controls the visibility of playlist UI section
    showTracks = false;  // Controls the visibility of tracks UI section
    @track simplifiedTrackArray = [];     // Tracks changes to the track array for reactivity
    trackIds = '';     // Stores track IDs for re-use in audio analysis callout


    columns = [
        { label: 'Name', fieldName: 'name' },
        { label: 'Link', fieldName: 'link', type: 'url' }
    ];

    // Fetch and process user profile data
    async handleGetProfile() {
        try {
            this.userProfile = await getUserProfile();
            this.userProfile = JSON.parse(this.userProfile);
            console.log(this.userProfile);
        } catch (error) {
            console.error('Error getting user profile', error);
        }
    }

    // Fetch and process user playlists
    async handleGetPlaylists() {
        try {
            this.userPlaylists = await getUserPlaylists();
            this.userPlaylists = JSON.parse(this.userPlaylists);
            console.log(this.userPlaylists);
        } catch (error) {
            console.error('Error getting user profile', error);
        }

        this.handlePlaylistArray();
        if (this.simplifiedPlaylistArray.length > 0) {
            {
                this.showPlaylists = true;
            }
        }
    }

    // Process playlists data to simplify and prepare for display
    handlePlaylistArray() {
        this.simplifiedPlaylistArray = this.userPlaylists.items.map(playlist => ({
            link: playlist.href,
            name: playlist.name,
            id: playlist.id,
            image: playlist.images[0].url
        }))
        console.log(this.simplifiedPlaylistArray);
    }

    async handlePlaylistSelect(event) {
        this.showTracks = false;
        const itemId = event.detail;
        console.log(`Clicked item ID: ${itemId}`);
        try {
            let playlist = await openPlaylist({ playListID: itemId });
            playlist = JSON.parse(playlist);
            console.log('Opening playlist: ', playlist);
            let tracksList = await getPlaylistTracks({ playListID: itemId });
            tracksList = JSON.parse(tracksList);
            console.log('Tracks: ', tracksList);
            if (tracksList.total > 0) {
                this.simplifiedTrackArray = tracksList.items.map(item => ({
                    name            : item.track.name,
                    artists         : item.track.artists.map(artist => artist.name),
                    artists_nonArray: item.track.artists.map(artist => artist.name).join(', '),
                    album           : item.track.album.name,
                    id              : item.track.id,
                    external_link   : item.track.external_urls.spotify,
                    href            : item.track.href
                }));
                this.trackIds = this.simplifiedTrackArray.map(track => track.id).join(',');
                console.log('Tracks IDs: ' + this.trackIds);
                let trackFeatures = await getMultiTrackAudioFeatures({ trackIDs: this.trackIds });
                trackFeatures = JSON.parse(trackFeatures);
                console.log('Track features: ', trackFeatures);

                this.showTracks = true;
                console.log(JSON.parse(JSON.stringify(this.simplifiedTrackArray)));
            }
            console.log('Tracks: ', tracksList);
        } catch (error) {
            console.error('Error getting user profile', error);
        }
    }

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

    // async handleAudioAnalysis() {
    //     console.log('Audio analysis');
    //     try {
    //         let trackFeatures = await getMultiTrackAudioFeatures({ trackIDs: this.trackIds });
    //         trackFeatures = JSON.parse(trackFeatures);
    //         console.log('Track analysis: ', trackFeatures);
    //     }








}


