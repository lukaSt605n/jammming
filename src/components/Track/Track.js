// Track.js
import React from 'react';
import PropTypes from 'prop-types';
import './Track.css';

function Track({ track, isRemoval, onAdd, onRemove }) {
  const handleAction = () => {
    isRemoval ? onRemove(track) : onAdd(track);
  };

  return (
    <div className="Track">
      <div className="Track-info">
        <h3>{track.title}</h3>
        <p>{track.artist} | {track.album}</p>
      </div>
      <button 
        className="Track-action" 
        onClick={handleAction}
      >
        {isRemoval ? '-' : '+'}
      </button>
    </div>
  );
}

Track.propTypes = {
  track: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    album: PropTypes.string.isRequired,
    uri: PropTypes.string.isRequired
  }).isRequired,
  isRemoval: PropTypes.bool.isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default Track;
