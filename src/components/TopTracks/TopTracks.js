// TopTracks.js
import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for validation
import './TopTracks.css';

function TopTracks({ tracks = [], onPlay }) {
  return (
    <div className="TopTracks">
      <h2>Your Top Tracks</h2>
      <div className="TrackList">
        {tracks.length === 0 ? (
          <p>No tracks available</p>
        ) : (
          tracks.map((track, index) => (
            <div className="Track" key={track.id}>
              <div className="Track-number">{index + 1}.</div>
              <div className="Track-info">
                <h3>{track.title}</h3>
                <p>{track.artist}</p>
              </div>
              <button 
                className="Play-button"
                onClick={() => onPlay(track.uri)}  
                title="Play track"
              >
                ▶
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

TopTracks.propTypes = {
  tracks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      artist: PropTypes.string.isRequired,
      uri: PropTypes.string.isRequired
    })
  ),
  onPlay: PropTypes.func.isRequired
};

export default TopTracks;
