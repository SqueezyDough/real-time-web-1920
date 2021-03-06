const SpotifyWebApi = require('spotify-web-api-node'),
      request = require('request'),  
      querystring = require('querystring')
     

require('dotenv').config()

const client_id = process.env.client_id,
      client_secret = process.env.client_secret,
      redirect_uri = process.env.redirect_uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
*/

let generateRandomString = function(length) {
    let text = ''
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  }
  
let stateKey = 'spotify_auth_state'

exports.login = function(req, res) {
    let state = generateRandomString(16)
    res.cookie(stateKey, state)
    
    // your application requests authorization
    let scope = 'user-read-private user-read-email'
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
    }))
}

exports.callback = function(req, res) {
    // your application requests refresh and access tokens
    // after checking the state parameter
    
    const code = req.query.code || null
    const state = req.query.state || null
    const storedState = req.cookies ? req.cookies[stateKey] : null
    
    if (state === null || state !== storedState) {
        res.redirect('/#' +
        querystring.stringify({
            error: 'state_mismatch'
        }))
    } else {
        res.clearCookie(stateKey)

        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        }
    
        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
        
                const access_token = body.access_token,
                      refresh_token = body.refresh_token
        
                const options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                }

                res.cookie('access_token', access_token)
        
                // use the access token to access the Spotify Web API
                request.get(options, function(error, response, body) {
                    console.log(body)
                })
        
                // we can also pass the token to the browser to make requests from there
                res.redirect('/#' +
                querystring.stringify({
                    access_token: access_token,
                    refresh_token: refresh_token
                }))
            } else {
                res.redirect('/#' +
                querystring.stringify({
                    error: 'invalid_token'
                }))
            }
        })
    }
}

exports.refreshToken = function (req, res) {
    // requesting access token from refresh token
    let refresh_token = req.query.refresh_token
    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
        },
        json: true
    }

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            let access_token = body.access_token
            res.send({
                'access_token': access_token
            })
        }
    })
}

exports.getPlayList = function(req, query) {
    const spotifyApi = new SpotifyWebApi({
        accessToken: req.cookies.access_token
    })

    return spotifyApi.searchTracks(query).then(
        data =>  data.body.tracks.items,
        err => console.log('Something went wrong!', err)
    )
}