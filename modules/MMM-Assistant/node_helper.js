var NodeHelper = require("node_helper");
let GoogleAssistant = require('google-assistant-node');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;


let constants = GoogleAssistant.Constants;
let encodings = constants.Encoding;
        let assistant = new GoogleAssistant({
            input: {
                encoding: encodings.LINEAR16,
                sampleRateHertz: 16000
            },
            output: {
                encoding: encodings.MP3,
                sampleRateHertz: 16000,
                volumePercentage: 100
            }
        });

        var oauth2Client = new OAuth2(
            "250699158552-snc5o9bigg0jekc6m3kk7j7fr2da59r1.apps.googleusercontent.com",
            "zqaGtJZUHtCySQQwg2YCQ3bD",
            "urn:ietf:wg:oauth:2.0:oob"
        );

// Audio Data (bytes)
        assistant.on('audio-data', (data) => {
        });

//  Reponse Text (string)
        assistant.on('response-text', (text) => {
            console.log("RESPONSE: " + text);
        });

//  Request Text (string)
        assistant.on('request-text', (text) => {
            console.log("REQUEST: " + text);
        });

//  Conversation State (bytes)
        assistant.on('state', (state) => {
            console.log("ASSISTANT: Ask me anything!");
        });

//  Microphone Mode (int)
        assistant.on('mic-mode', (mode) => {
            console.log("Listening ... ");
        });

// Authorization error (error)
// E.g. Did not authenticate with OAuth client
        assistant.on('unauthorized', (error) => {
            console.log("Starting module: " + this.name);
        });

//  Error (error)
        assistant.on('error', (error) => {
        });

// Assistant is ready to accept audio data. NOTE: .once() is used.
        assistant.once('ready', (wstream) => {
            //audioData.pipe(wstream);
        });

// Current conversation is over.
// NOTE: 'end' will be called even if there is a 'follow-on' event.
        assistant.once('end', () => {
        });

// Assistant is expecting a follow-on response from user.
        assistant.on('follow-on', () => {

            // Setup follow-on 'ready' and 'end' event handler to change audio source
            // if desired (or if you used .once()).
            assistant.once('ready', (wstream) => {
                //moreAudioData.pipe(wstream)
            });

            // Handle follow-on conversation end.
            assistant.once('end', () => {
               // moreAudioData.end();
            });

            // Don't forget to call .converse() to resume conversation
            assistant.converse();
        });

// Use Google OAuth Client to authenticate:
// https://github.com/google/google-auth-library-nodejs
// or
// https://github.com/google/google-api-nodejs-client
        assistant.authenticate(oauth2Client);

// Start conversation
        assistant.converse();

