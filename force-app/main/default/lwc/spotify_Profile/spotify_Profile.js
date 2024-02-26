import { LightningElement } from 'lwc';
import getUserProfile from '@salesforce/apex/Spotify_lwcController.getUserProfile';
import getUserPlaylists from '@salesforce/apex/Spotify_lwcController.getUserPlaylists';

export default class Spotify_Profile extends LightningElement {

    userProfile             = {};
    userPlaylists           = {};
    simplifiedPlaylistArray = [];
    showPlaylists            = false;
    
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
            id: playlist.snapshot_id,
            image: playlist.images[0].url
        }))
        console.log(this.simplifiedPlaylistArray);
    }

    handlePlaylistClick(event) {
        const itemId = event.currentTarget.dataset.id;
        console.log(`Clicked item ID: ${itemId}`);
    }

   

}


    