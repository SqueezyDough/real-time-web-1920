# Concept
## Artistry.IO
For this course I am building a artist guessing game where players try to guess artists from a song that is playing and get points when they guess it right. When the players fails to guess the song, the song is stored and the players can create a playlist from them.

------

## Data life cycle diagram
![DLC](https://user-images.githubusercontent.com/33430653/79844466-fde52f80-83bb-11ea-948d-2f46a67b4cdf.png)

------

### Persistant data
Persistant data is used for data that is immutable. This data does not need to be modified in the future.
- Finished games are saved in a MongoDB with the end results

### Non-persistant data
Data on the server is used for running processes. The data is likely to change and important for running processes.
- Running game rooms are stored on the server and cleared when finished

------

## Features
- [X] User can join a room to start a game. Multiple users can join a room
- [X] Songs play for 30 seconds. when everyone is ready, the next song will play
- [X] Players score points when they guess a song right
- [X] Scoreboard including user names and their score
- [X] Chat functionality
- [X] Correct answers are hidden from the chat room
- [ ] Playlists can be created from the guessed / not guessed songs
- [ ] Game over screen with top 3
- [ ] Hints and random song keywords
- [ ] Finished games are stored in a mongoDB

------

## Install notes
1. Clone this repository
2. Install dependancies: `npm install`
3. Run application: `npm run start`
