import React, { useState, useEffect, useCallback } from 'react';
import Spotify from './utils/Spotify';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import TopTracks from './components/TopTracks/TopTracks';
import './App.css';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState('My Playlist');
  const [topTracks, setTopTracks] = useState([]);
  const [error, setError] = useState('');

  // Load top tracks once when the component mounts
  useEffect(() => {
    const loadTopTracks = async () => {
      try {
        const tracks = await Spotify.getTopTracks();
        setTopTracks(tracks);
      } catch (err) {
        setError('Failed to load top tracks. Please try again.');
      }
    };

    if (Spotify.getAccessToken()) loadTopTracks();
  }, []); // Empty dependency array ensures it runs once

  // Add track to playlist if it's not already there
  const addTrack = useCallback((track) => {
    setPlaylistTracks(prevTracks => {
      const trackSet = new Set(prevTracks.map(t => t.id));
      if (!trackSet.has(track.id)) {
        return [...prevTracks, track];
      }
      return prevTracks;
    });
  }, []);

  // Remove track from playlist
  const removeTrack = useCallback((track) => {
    setPlaylistTracks(prevTracks => prevTracks.filter(t => t.id !== track.id));
  }, []);

  // Handle searching for tracks
  const handleSearch = async (term) => {
    try {
      setError('');
      const results = await Spotify.search(term);
      setSearchResults(results);
    } catch (err) {
      setError('Search failed. Please try again.');
    }
  };

  // Handle playback of the selected track
  const handlePlay = async (trackUri) => {
    try {
      await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${Spotify.getAccessToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uris: [trackUri] }),
      });
    } catch (err) {
      setError('Playback requires Spotify Premium. Please check your subscription.');
    }
  };

  // Save the current playlist to Spotify
  const savePlaylist = async () => {
    try {
      await Spotify.createPlaylist(
        playlistName,
        playlistTracks.map(track => track.uri)
      );
      setPlaylistTracks([]); // Clear playlist after saving
      setPlaylistName('New Playlist'); // Reset playlist name
    } catch (err) {
      setError('Failed to save playlist. Please try again.');
    }
  };

  return (
    <div className="App">
      <h1>Ja<span className="highlight">mmm</span>ing</h1>

      {/* Display error message if one exists */}
      {error && <div className="error">{error}</div>}

      {/* Search bar component */}
      <SearchBar onSearch={handleSearch} />

      {/* Playlist and Search Results */}
      <div className="App-playlist">
        <SearchResults 
          tracks={searchResults} 
          onAdd={addTrack} 
          onPlay={handlePlay} 
        />
        <Playlist
          name={playlistName}
          tracks={playlistTracks}
          onRemove={removeTrack}
          onNameChange={setPlaylistName}
          onSave={savePlaylist}
          onPlay={handlePlay}
        />
        <TopTracks 
          tracks={topTracks}
          onPlay={handlePlay}
        />
      </div>
    </div>
  );
}

export default App;
