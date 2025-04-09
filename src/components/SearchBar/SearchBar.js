import React, { useState, useEffect } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState(localStorage.getItem('searchTerm') || '');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(''); // State to track errors

  // Save to localStorage with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('searchTerm', searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle search request
  const handleSearch = async () => {
    if (searchTerm.trim() && !isSearching) {
      setIsSearching(true);
      setError(''); // Clear any previous errors
      try {
        await onSearch(searchTerm); // Call the onSearch prop function
      } catch (err) {
        setError('Error occurred during search. Please try again.'); // Handle errors
      } finally {
        setIsSearching(false);
      }
    }
  };

  // Handle key press (Enter key for search)
  const onKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="SearchBar">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder="Enter song or artist"
        disabled={isSearching}
      />
      <button 
        onClick={handleSearch}
        disabled={isSearching || !searchTerm.trim()}
      >
        {isSearching ? 'Searching...' : 'SEARCH'}
      </button>
      
      {/* Display error message if any */}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default SearchBar;
