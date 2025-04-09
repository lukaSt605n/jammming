import React, { useState } from 'react';
import Track from '../Track/Track';
import PropTypes from 'prop-types'; // Adding PropTypes for better prop validation
import './Playlist.css';

function Playlist({ name, tracks, onRemove, onNameChange, onSave }) {
  const [error, setError] = useState(''); // State to track errors during save

  const handleSave = async () => {
    try {
      await onSave(); // Attempt to save the playlist
    } catch (err) {
      setError('Failed to save playlist. Please try again.'); // Handle errors
    }
  };

  return (
    <div className="Playlist">
      {/* Playlist name input */}
      <input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Playlist name"
      />

      {/* Display error message if any */}
      {error && <div className="error-message">{error}</div>}

      {/* List of tracks */}
      <div className="TrackList">
        {tracks.map(track => (
          <Track
            key={track.id}
            track={track}
            isRemoval={true}
            onRemove={onRemove}
          />
        ))}
      </div>

      {/* Save button */}
      <button onClick={handleSave}>SAVE TO SPOTIFY</button>
    </div>
  );
}

// Prop validation with PropTypes
Playlist.propTypes = {
  name: PropTypes.string.isRequired,
  tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRemove: PropTypes.func.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default Playlist;
