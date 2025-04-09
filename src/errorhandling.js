// Function to log errors conditionally based on the environment
const logError = (message, error) => {
  if (process.env.NODE_ENV !== 'production') {
    // Log error details in development environment for debugging
    console.error(message, error);
  } else {
    // In production, you could send the error to a remote logging service (e.g., Sentry, LogRocket)
    // Example: sendErrorToService(message, error);
  }
};

// Function to perform search operation via Spotify API
const search = async (term, accessToken) => {
  try {
    // Validate accessToken before making the request
    if (!accessToken) {
      throw new Error('Access token is required for authentication');
    }

    // Make the API request to Spotify
    const response = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=${term}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // Check if the response was successful
    if (!response.ok) {
      throw new Error(`Search failed for term "${term}": ${response.status} ${response.statusText}`);
    }

    // Parse and return the response JSON data
    const data = await response.json();
    return data.tracks.items;

  } catch (error) {
    // Log the error and rethrow it for further handling
    logError('Search Error:', error);
    throw error; // Re-throwing the error after logging it
  }
};
