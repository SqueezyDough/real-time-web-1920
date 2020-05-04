# Concept
## Artistry.IO
For this course I am building a artist guessing game where players try to guess artists from a song that is playing and get points when they guess it right. When the players fails to guess the song, the song is stored and the players can create a playlist from them.

------
## Data management
### Data life cycle diagram
![DLC](https://user-images.githubusercontent.com/33430653/79844466-fde52f80-83bb-11ea-948d-2f46a67b4cdf.png)

------

### Single source of truth
#### Server
Only the server has a collection of all rooms and user. The server validates answers and updates scores. The server also is responsible for the game metadata as the game state, which song is currently playing, which users are in a queue waiting for the next song and triggers a timeout when a user isn't added to the queue in time.

#### Client
The client only recieves game updates from the server like the new song url and a list of users with their scores. You can send a message to the server to give the answer or post a message in the chat, but the answer validation is only handled on the server.

### Persistant data
Persistant data is used for data that is immutable. This data does not need to be modified in the future.
- Finished games are saved in a MongoDB with the end results

### Non-persistant data
Data on the server is used for running processes. The data is likely to change and important for running processes.
- Running game rooms are stored on the server and cleared when finished

------

## Features
- [X] User can join a room to start a game. Multiple users can join a room
- [X] New users can join while session has started and the correct song will be played from the playlist
- [X] Songs play for 30 seconds. After everyone is ready, the next song will play to prevent syncing issues. 
- [X] Players score points when they guess a song right
- [X] Scoreboard including user names and their score
- [X] Chat functionality
- [X] Correct answers are hidden from the chat room
- [X] Score more points when you are faster
- [ ] Playlists can be created from the guessed / not guessed songs
- [ ] Game over screen with top 3
- [ ] Hints and random songs
- [ ] Finished games are stored in a mongoDB

------

## Install notes
1. Clone this repository
2. Install dependancies: `npm install`
3. Run application: `npm run start`
