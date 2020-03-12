import Room from './Room'
//************************Room Tracking***********************//
//********Use as interface between socket.io and classes******//
//******Only manipulate variables not present in classes*******/

class RoomServer { 
    constructor(){
        this.rooms = {}, 
        this.lobby = {
            messages: [], 
            rooms: [],
        }, 
        this.roomCount= 0
    }

    getLobbyRooms(){
        return this.lobby.rooms
    }

    getLobbyMessages(){
        return this.lobby.messages
    }

    getRoomCount(){
        return this.roomCount
    }

    getRoom(id){
        return this.rooms[id];
    }

    getRound(id){
        const room = this.getRoom(id);
        return room.rounds[(room.roundNumber - 1)];
    }

    getPlayers(id){
        const room = this.getRoom(id)
        return room.getPlayers()
    }

    createRoom(name, userId, username, locked, PIN){
        const newRoom = new Room(name, userId, username, locked, PIN); // Create a new room instance
        this.rooms[newRoom.id] = newRoom; // store it in main object
        this.lobby.rooms.push({ id: newRoom.id, name: newRoom.name }); // Store it in the short list for the lobby (so we don't bombard the user with full data everytime) 
        ++this.roomCount; // keep track of number of rooms for display
        return newRoom.id // return the room id for socket.io to assign to the user
    }

    joinRoom(id, userId, username){
        const room = this.getRoom(id); // find room instance based on id
        return room.addPlayer(userId, username); // add player to room list and return true/false if the room is full or not 
    }

    leaveRoom(id, userId, username){
        const room = this.getRoom(id); // find room instance based on id
        const destroy = room.removePlayer(userId, username); // remove the player from the room, get back t/f if the room was flgged for destroy
        if (destroy) {
            this.tearDownRoom(id)
        }
        return destroy
    }

    // called from socket('ready')
    playerReady(id, userId){
        const room = this.getRoom(id);
        const king = room.readyCheck(userId); 
        if (king) {

        };
        return king; // pass back up to socket('ready')
    }

    setQuestion(id, question){
        const round = this.getRound(id);
        round.setQuestion(question);
    }

    setAnswer(id, answer, userId){
        const round = this.getRound(id);
        return round.setAnswer(answer, userId);
    }


    submitUpvote(id, userId, targetUserId){
        const round = this.getRound(id);
        round.submitUpvote(userId, targetUserId);
    }

    submitDownvote(id, userId, targetUserId){
        const round = this.getRound(id);
        round.submitDownvote(userId, targetUserId);
    }

    assassinate(id, userId){
        const round = this.getRound(id);
        return round.assassinate(userId); 
    }

    // called after voting / assassin timer ends
    endRound(id){
        const room = this.getRoom(id);
        const round = this.getRound(id);
        const newRound = round.endRound(); // round parses end results and creates a new round
        const new_id = room.nextRound(newRound); // new_id is either the id of the room (signifying the game has ended) or the id of the king (which means play a new round)
        if (new_id === room.id) {
            this.endGame(new_id)
            return { ended: true, king: newRound.king } // game has ended flag plus the winner
        } else if (new_id === newRound.king) {
            return { ended: false, king: newRound.king }// return the king to start a new round client side
        }
    }

    endGame(id){
        this.tearDownRoom(id);
    }

    removeRoomFromLobby(id){
        let filtered = this.lobby.rooms.filter((value, index, arr) => {
            return value.id !== id;
        });
        this.lobby.rooms = filtered
    }

    tearDownRoom(id){ // initiated when the last player leaves the room or game ends
        this.removeRoomFromLobby(id) // delete room from lobby room list
        let room = this.getRoom(id); // find the room by id in main object
        room = null; // delete room data from main object and memory*** 
        --this.roomCount;
    }
};

const roomServer = new RoomServer();
export default roomServer;