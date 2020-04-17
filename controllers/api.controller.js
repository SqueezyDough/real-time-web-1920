const fetch = require('node-fetch')
require("dotenv").config()

exports.getRandomGiphy = async topic => {
    const limit = 50
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${process.env.apiKey}&q=${topic}&limit=${limit}&offset=0&rating=G&lang=en`
    const giphies = await fetchData(url)
  
    return giphies.data[Math.floor(Math.random() * giphies.data.length)].images.looping.mp4;
}

exports.getRandomSong = async () => {
    
}


function fetchData(url) {
    return fetch(url)
        .then(data => data.text())
        .then(data => JSON.parse(data.trim()))
}