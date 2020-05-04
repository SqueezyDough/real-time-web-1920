# Concept
## Artistry.IO
For this course I am building a artist guessing game where players try to guess artists from a song that is playing and get points when they guess it right. Players have 30 seconds to guess a song util the game moves on to the next one. When the players fails to guess the song, the song is stored and the players can create a playlist from them.
![start](https://user-images.githubusercontent.com/33430653/81015877-bbadfa80-8e5f-11ea-87c0-8ccfb5c1559a.png)

<details>
  <summary> Guessed an artist </summary>
  
  ![correct](https://user-images.githubusercontent.com/33430653/81015872-bb156400-8e5f-11ea-8c53-a3c5cbf62a70.png)
</details>

<details>
  <summary> Rooms list </summary>
  
  ![rooms](https://user-images.githubusercontent.com/33430653/81015880-bcdf2780-8e5f-11ea-8291-8ba4652e24e0.png)
</details>

### Course goals
- Deal with real-time complexity
- Handle real-time client-server interaction
- Handle real-time data management
- Handle multi-user support

------
## Data management
### Data life cycle diagram
![DLC](https://user-images.githubusercontent.com/33430653/81014096-85bb4700-8e5c-11ea-9481-f8c3271d33d8.png)

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

## Synchronising clients
There can be a difference in what clients are playing. For example when a user joins a room mid-song the user will hear the song from the start while the other have almost finished the song and will move on to the next. To fix this issue I had to think about synchronising the clients when a new song is sent to the client. I did that with the following methods:

### User queue
When a client has finished playing its song, it sends a message to the server. The server puts this user in a queue allong with everyone else who sent this particular message and is waiting for the next song to play. When all users from that room have joined the queue the next song will then be sent to the clients and this cycle repeats.

### Set a timeout
A user queue can help when there are just a few seconds between the client's progression, but when a user joins 10-20 seconds later the other users have to wait a long time. Therefore the first user in the queue also triggers a timeout function of 5 seconds. When this timer is reached the next song will play automatically and the users who are not yet in the queue will be synced with the others.

## Features
- [X] Multi-room support. Users can create and join seperate rooms.
- [X] Multiple users can join a single room.
- [X] New users can join while session has started and the correct song will be played from the playlist.
- [X] The server has a timer for when users timeout, so other user won't need to wait on a user who might be disconnected or is not synced properly.
- [X] Users can guess the artist from the song that is currently playing
- [X] Songs play for 30 seconds. After everyone is ready, the next song will play.
- [X] Players score points when they guess a song right.
- [X] Scoreboard including user names and their score.
- [X] Players can use in-game chat.
- [X] Correct answers are hidden from the chat room.
- [X] Score more points when you are faster.
- [X] Cheat mode.

### If I had more time
- [ ] Playlists can be created from the guessed / not guessed songs
- [ ] Game over screen with top 3.
- [ ] Hints and randomized songs.
- [ ] Users take turns to choose a playlist.
- [ ] Finished games are stored in a mongoDB.

------

## Socket events
### Server
Socket events that get picked up by the server (emit from client)

| Event name | Trigger | Function |
|---|---|---|
| new-user | When a user joins a room | Add user to the room |
| disconnect | When the user disconnects from the room | Remove the user from the room |
| send-chat-message | When the user types a message | Handles all chat input messages. Validates the messages and decides whether it should be posted in the chat. Also checks whether the message contains the correct answer for the game and updates scores if guessed right |
| client-done | When a client has fully played the audio | Puts the corresponding userID in a queue and waits for the other users to play the next song. Updates the game metadata accordingly

### Client
Socket events that get picked up by the client (emit from server)

| Event name | Trigger | Function |
|---|---|---|
| user-joined | When a user joins a room | Send a '`user` joined' message to all users in this room |
| user-left | When a user disconnects from the room | send a '`user` left' message to all users in this room
| room-created | When a user creates a room | Add the room to the rooms list with a join link |
| chat-message | When a user types  a message | Add the message to the in-game chat
| hint-message | When the user has types `/hint` in chat | Show a hint in the in-game chat (only visible for that user)
| update-game-message | When somethings happens related to this song / game | Show what happened
| update-users-list | When someone joins or leaves | Add or remove the user from the list
| update-score | When a user guessed a song | Update the leaderboard
| watch-player-ended | When a new song is sent to the client | Tell the server the client has fully played the audio
| send-new-song | When a new song is sent to the client | update the player `src` attribute
| game-end | When all songs are played | Show leaderboard and archive game results in database

## API
### Setting up
I am using the spotify API to fetch songs and create playlist and the Spotify-API wrapper from [thelinmichael
](https://github.com/thelinmichael/spotify-web-api-node) for ease-of-access. The spotify API can be used for free, but you do need a spotify account to work. 

The authentication works via [OAuth 2.0](https://oauth.net/articles/authentication/) delegation protocol which needs a clientID, secretID and a Redirect URI. To set this up you'll need to go to the [Spotify Developers Dasboard](https://developer.spotify.com/dashboard/) and login with your (fresh) Spotify account. From here you can create a new app. Just follow the intructions on your screen. 

Once set-up you'll see your clientID and secretID. Make sure you also enter the redirect URL as this is the URL you will return to when your users are logged in and make sure you save your ClientID and secretID securely in a .env file. In the end your .env filee should look like this:
```
CLIENT_ID='client id'
CLIENT_SECRET='client secret'
REDIRECT_URI='your redirect uri'
```

**Whitelist both your development redurect URI's as your Production redirect URI's!**

To use the .env variables you'll need to install the [dotenv](https://www.npmjs.com/package/dotenv) npm package and usit in your app. Your server-side code should look like this:
```
require('dotenv').config()

const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
const redirect_uri = process.env.REDIRECT_URI
```

## Dependancies
- body-parser
- cookie-parser
- dotenv
- express
- express-handlebars
- node-fetch
- querystring
- request
- socket.io
- socket.io-client
- spotify-web-api-node

## Browser support
- Chrome
- Firefox
- Brave

**Autoplay should be turned on**

## Install notes
1. Clone this repository
```
git clone
```

2. Install dependancies
```
npm install
```

3. Add a .env file and include it in your .gitignore file
```
CLIENT_ID='client id'
CLIENT_SECRET='client secret'
REDIRECT_URI='your redirect uri'
```

4. Run application
```
npm run start
```

### Chat commands
- Type `/hint` in chat to get a hint!
