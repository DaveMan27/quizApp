import { LightningElement, track } from 'lwc';
import getUserProfile from '@salesforce/apex/Spotify_lwcController.getUserProfile';
import getUserPlaylists from '@salesforce/apex/Spotify_lwcController.getUserPlaylists';
import openPlaylist from '@salesforce/apex/Spotify_lwcController.openPlaylist';
import getPlaylistTracks from '@salesforce/apex/Spotify_lwcController.getPlaylistTracks';

export default class Spotify_Profile extends LightningElement {

           userProfile             = {};
           userPlaylists           = {};
    @track simplifiedPlaylistArray = [];
           showPlaylists           = false;
           showTracks              = false;
    @track simplifiedTrackArray    = [];
    
    columns = [
        { label: 'Name', fieldName: 'name' },
        { label: 'Link', fieldName: 'link', type: 'url' }        
    ];

    async handleGetProfile() {
        try {
            this.userProfile = await getUserProfile();
            this.userProfile = JSON.parse(this.userProfile);
            console.log(this.userProfile);
        } catch (error) {
            console.error('Error getting user profile', error);
        }
    }

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

    handlePlaylistArray()
    {
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
            if (tracksList.total > 0) {
                this.simplifiedTrackArray = tracksList.items.map(item => ({
                    name   : item.track.name,
                    artists: item.track.artists.map(artist => artist.name),
                    artists_nonArray : item.track.artists.map(artist => artist.name).join(', '),
                    album: item.track.album.name
                }));

                this.showTracks = true;
                console.log(JSON.parse(JSON.stringify(this.simplifiedTrackArray)));
            }
            console.log('Tracks: ', tracksList);
        } catch (error) {
            console.error('Error getting user profile', error);
        }
    }

    





   

}


    