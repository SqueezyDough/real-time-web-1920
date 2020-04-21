# Song guessing game
For this course I am building a guessing game where players try to guess songs and get points when they guess it right. When the players fails to guess the song, the song is stored and the players can create a playlist from them.

------

## Data life cycle diagram
![DLC](https://user-images.githubusercontent.com/33430653/79760836-e9a02480-8320-11ea-8563-d67f2a840f92.png)

------

### Persistant data
Persistant data is used for data that is immutable. This data does not need to be modified in the future.

- Finished games are saved in a MongoDB with the end results

### Non-persistant data
Data on the server is used for running sessions

- Running game rooms are stored on the server and cleared when finished

------

## Features
- User can join a room to start a game
- A room can have up to 5 users
- The host can select a playlist
- Players score points when they guess a song right
- After each round the score will be updated
- Playlists can be created from the guessed / not guessed songs

------

## Install notes
1. Clone this repository
2. Install dependancies: `npm install`
3. Run application: `npm run start`
