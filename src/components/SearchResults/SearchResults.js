import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import Track from '../Track/Track';
import './SearchResults.css';

function SearchResults({ tracks, onAdd, onPlay }) {
  const [error, setError] = useState(null);
  const [validTracks, setValidTracks] = useState([]);

  useEffect(() => {
    // Error handling for invalid or empty tracks data
    if (!Array.isArray(tracks)) {
      setError('Invalid track data: Expected an array');
      setValidTracks([]);
    } else if (tracks.length === 0) {
      setError('No results found');
      setValidTracks([]);
    } else {
      const filteredTracks = tracks.filter((track) => track && track.id);
      if (filteredTracks.length !== tracks.length) {
        setError('Some tracks are invalid and were excluded');
        console.warn('Some tracks were invalid and excluded', tracks);
      } else {
        setError(null); // Reset error when all tracks are valid
      }
      setValidTracks(filteredTracks);
    }
  }, [tracks]); // Re-run this check if tracks change

  if (error && validTracks.length === 0) {
    return <div className="error">{error}</div>; // Display error message if there is an issue
  }

  return (
    <div className="SearchResults">
      <h2>Search Results</h2>
      {validTracks.length === 0 ? (
        <p>No results found</p> // Display this if validTracks are empty
      ) : (
        <div className="TrackList">
          {validTracks.map((track) => (
            <Track
              key={track.id}
              track={track}
              isRemoval={false}
              onAdd={onAdd}
              onPlay={onPlay}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Prop validation using PropTypes
SearchResults.propTypes = {
  tracks: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onPlay: PropTypes.func.isRequired,
};

export default React.memo(SearchResults); // Using React.memo for optimization

