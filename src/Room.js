import uuidv4 from 'uuid/v4'
import Round from './Round'

//*****************New Room Instances*********************//
//*****Write all variable manipulation within class*******//

class Room {
    constructor(name, userId, username, locked, PIN) {
        this.id = uuidv4(); // random string generator
        this.name = name; //string of the room name
        this.players = {};
        this.players[userId] = {id: userId,
            name: username, 
            points: 0}; // players object literal
        this.locked = locked; // boolean, false for public, true for private
        this.PIN = PIN; // string of required pin for authentication to a public room
        this.minimumPlayers = 3; // minimum number of players to start the game, make this an optional value later
        this.playerCount = 1; // start with 1 player, added and subtracted as players leave
        this.readyCount = [] // keep track of ready count
        this.rounds = []; // we'll store an array of all the rounds to track points etc.
        this.roundNumber = 0; // to track rounds
        this.gameLength = 1 // how many rounds the game lasts
        this.messages = []; // for room chat
    }
    
    getPlayers(){
        return this.players;
    }

    addPlayer(userId, username) {
        this.players[userId] = {
            id: userId,
            name: username,
            points: 0
            }; // add player object to players
        ++this.playerCount // keep track of number of players
        return this.playerCount === this.minimumPlayers// set the number of players necessary to trigger a game start 
        // send true back up to RoomServer object that the room is full
    }
    
    removePlayer(userId) {
        this.players[userId] = null; // remove player name from players object
        --this.playerCount; // keep track of number of players
        return this.playerCount === 0 // if the room is then empty // start deletion of the room
        // ADD FUNCTIONALITY TO REMOVE PLAYER FROM CURRENT ROUND
    }

    authenticatePlayer(userId, PIN) { // mockup of authentication
        if (this.locked) {
            if (this.PIN === PIN) {
                this.addPlayer(userId);
            };
        };
    }
    // called from RoomServer.playerReady
    readyCheck(userId) { // need to figure out how to handle someone leaving during the ready check process.
        this.readyCount.push(userId) // maybe we eliminate the ready check process entirely
        if (this.readyCount.length === this.minimumPlayers) { // for now keep it as is in case we decide to keep it overall
            return this.startGame(); //return king back up to RoomServer.playerReady
        }
    }
    // called from this.readyCheck
    startGame() {
        ++this.roundNumber; // add to round number
        const firstRound = new Round( // start first round object
            this.players, // pass players in every round in case someone leaves
            this.readyCount[0], // for now first person to ready up is the king
            this.readyCount[1]); // for now the second person to ready up is the rebel
        this.rounds.push(firstRound); // add to rounds list for tracking
        return this.readyCount[0]; // return king back up to this.readyCheck to allow user to propose question
    }
    // called from roomServer.endRound
    nextRound(newRound) {
        if (this.roundNumber === this.gameLength) {
            return this.id
        } else {
            this.players = newRound.players
            ++this.roundNumber;
            this.rounds.push(newRound); // add to rounds list for tracking
            return newRound.king
        }
    }
};

export default Room