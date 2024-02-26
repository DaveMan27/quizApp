import { LightningElement, track } from 'lwc';
import getUserProfile from '@salesforce/apex/Spotify_lwcController.getUserProfile';
import getUserPlaylists from '@salesforce/apex/Spotify_lwcController.getUserPlaylists';
import openPlaylist from '@salesforce/apex/Spotify_lwcController.openPlaylist';

export default class Spotify_Profile extends LightningElement {

           userProfile             = {};
           userPlaylists           = {};
    @track simplifiedPlaylistArray = [];
           showPlaylists           = false;
    
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
        const itemId = event.detail;
        console.log(`Clicked item ID: ${itemId}`);
        try {
            let playlist = await openPlaylist({ playListID: itemId });
            playlist = JSON.parse(playlist);
            console.log('Opening playlist: ', playlist);
        } catch (error) {
            console.error('Error getting user profile', error);
        }
    }



   

}


    