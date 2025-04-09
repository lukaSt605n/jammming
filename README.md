# Jammming 🎵  
**Codecademy Portfolio Project**  

A React web app that lets you create Spotify playlists by searching for songs and saving them to your account. Built as part of Codecademy's Front End career path.

## Features 🎮  
✔️ Spotify login integration  
✔️ Real-time song search  
✔️ Playlist creation/editing  
✔️ Save playlists to Spotify  
✔️ Responsive design  

## Tech Stack 💻  
- React  
- Spotify API  
- JavaScript  
- CSS3  

## Setup Instructions 📦  

1. **Clone repository**  
`git clone https://github.com/your-username/jammming.git`  

2. **Install dependencies**  
`npm install`  

3. **Set up Spotify Developer App**  
   - Create app at [Spotify Dashboard](https://developer.spotify.com/dashboard)  
   - Add `http://localhost:3000` as Redirect URI  
   - Copy Client ID  

4. **Configure app**  
   - Paste Client ID in `src/utils/Spotify.js`:  
   ```javascript
   const clientId = 'YOUR_SPOTIFY_CLIENT_ID';
