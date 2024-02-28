public class Spotify_lwcController {
    
    @AuraEnabled(cacheable=true)
    public static string getUserProfile() {
        HttpResponse apiResponse = Spotify_Utility.calloutHandler('users/daveslaw-us');
        system.debug('apiResponse: ' + apiResponse);
        return apiResponse.getBody();
    }

    @AuraEnabled(cacheable=true)
    public static string getUserPlaylists() {
        HttpResponse apiResponse = Spotify_Utility.calloutHandler('users/daveslaw-us/playlists');
        system.debug('apiResponse: ' + apiResponse);
        return apiResponse.getBody();
    }

    @AuraEnabled(cacheable=true)
    public static string openPlaylist(string playListID) {
        HttpResponse apiResponse = Spotify_Utility.calloutHandler('playlists/' + playListID);
        system.debug('apiResponse: ' + apiResponse);
        return apiResponse.getBody();
    }

    @AuraEnabled(cacheable=true)
    public static string getPlaylistTracks(string playListID) {
        HttpResponse apiResponse = Spotify_Utility.calloutHandler('playlists/' + playListID + '/tracks');
        system.debug('apiResponse: ' + apiResponse);
        return apiResponse.getBody();
    }

    @AuraEnabled(cacheable=true)
    public static string getTrackAudioFeatures(string trackID) {
        HttpResponse apiResponse = Spotify_Utility.calloutHandler('audio-features/' + trackID);
        system.debug('apiResponse: ' + apiResponse);
        return apiResponse.getBody();
    }



    /*@AuraEnabled(cacheable=true)
    public static string getUserAlbums() {
        HttpResponse apiResponse = Spotify_Utility.calloutHandler('daveslaw-us/albums');
        system.debug('apiResponse: ' + apiResponse);
        return apiResponse.getBody();
    }*/

    
}