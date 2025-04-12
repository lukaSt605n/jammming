const clientId = 'client ID';
const redirectUri = window.location.href;

let accessToken = null;
let tokenExpiration = 0;

const Spotify = {
  getAccessToken() {
    const now = Date.now();
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    // Check if the token has expired or doesn't exist
    if (now > tokenExpiration || !accessToken) {
      accessToken = params.get('access_token');
      const expiresIn = params.get('expires_in') * 1000;

      if (accessToken) {
        console.log('Access Token:', accessToken); // Log the token for debugging
        tokenExpiration = now + expiresIn;
        window.history.replaceState({}, '', window.location.pathname);
      } else {
        const scopes = [
          'playlist-modify-public',
          'user-top-read',
          'streaming'
        ].join('%20');
        
        // Redirect to Spotify authorization
        window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`;
      }
    }
    return accessToken;
  },

  async search(term) {
    try {
      const token = this.getAccessToken();
      if (!token) throw new Error('Access token is missing.');

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(term)}&type=track&limit=10`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error(`Spotify API error: ${response.statusText}`);

      const json = await response.json();
      return json.tracks.items.map(track => ({
        id: track.id,
        title: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    } catch (error) {
      console.error('Error in search:', error);
      throw error; // Re-throw the error so it can be handled elsewhere if needed
    }
  },

  async createPlaylist(name, trackUris) {
    try {
      const token = this.getAccessToken();
      if (!token) throw new Error('Access token is missing.');

      const headers = { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      };

      // Fetch user data to get user ID
      const userResponse = await fetch('https://api.spotify.com/v1/me', { headers });
      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        console.error('Failed to fetch user info:', errorData);
        throw new Error(`Failed to fetch user info: ${userResponse.statusText}`);
      }
      const userData = await userResponse.json();

      // Create the playlist
      const playlistResponse = await fetch(
        `https://api.spotify.com/v1/users/${userData.id}/playlists`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ name, public: false })
        }
      );

      if (!playlistResponse.ok) {
        const errorData = await playlistResponse.json();
        console.error('Playlist creation failed:', errorData);
        throw new Error(`Failed to create playlist: ${playlistResponse.statusText}`);
      }
      const playlistData = await playlistResponse.json();

      // Add tracks to the created playlist
      const trackResponse = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ uris: trackUris })
        }
      );

      if (!trackResponse.ok) {
        const errorData = await trackResponse.json();
        console.error('Failed to add tracks to playlist:', errorData);
        throw new Error(`Failed to add tracks to playlist: ${trackResponse.statusText}`);
      }

    } catch (error) {
      console.error('Error in createPlaylist:', error);
      throw error;
    }
  },

  async getTopTracks() {
    try {
      const token = this.getAccessToken();
      if (!token) throw new Error('Access token is missing.');

      const response = await fetch(
        'https://api.spotify.com/v1/me/top/tracks?limit=10',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error(`Spotify API error: ${response.statusText}`);

      const json = await response.json();
      return json.items.map(track => ({
        id: track.id,
        title: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    } catch (error) {
      console.error('Error in getTopTracks:', error);
      throw error;
    }
  }
};

export default Spotify;
