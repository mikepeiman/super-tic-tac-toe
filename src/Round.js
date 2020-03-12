//********************Round Instances*********************//
//*****Write all variable manipulation within class*******//

class Round {
  constructor(players, king, rebel) {
      this.players = players // object of player objects to pass back after the round is over.
      this.king = king; // id of the king
      this.rebel = rebel; // id of the rebel
      this.assassin = ''; // id of the assassin
      this.question = ''; // the question for the round
      this.answers = []; // array of answers
      this.kingUpvoted = []; // array of player id's that the king has upvoted, to check at end of round
      this.kingDownvoted = [];
  }

  setQuestion(question) {
      this.question = question;
  }

  setAnswer(answer, userId) {
      this.answers.push({answer: answer, id: userId})
      if (this.answers.length === Object.keys(this.players).length) {
          return this.answers;
      }
  }

  assassinate(userId) {
      if (this.players[userId].points >= 4) {
          this.assassin = userId;
      } else {
          return 'You do not have enough points'
      }
  }

  submitUpvote(userId, targetUserId) {
      if (userId === this.king) {
          this.kingUpvoted.push(targetUserId);
      };
      this.players[targetUserId].points += 4
  }

  submitDownvote(userId, targetUserId) {
      if (userId === this.king) {
          this.kingDownvoted.push(targetUserId);
      };
      this.players[targetUserId].points -= 1
      if (this.players[targetUserId] < 0) {
          this.players[targetUserId] = 0;
      };
  }

  endRound() {
      let kingTracker = 0;
      let king = ''; // player id
      let rebelTracker = 0
      let rebel = ''; // player id
      if (this.assassin !== '') {
          this.players[this.assassin].points = Math.ceil(this.players[this.assassin].points / 2); // divide the assassins points by half, this is the cost of the attempt
          this.kingUpvoted.forEach(userId => { // check to see if the king upvoted the assassin
              if (userId === this.assassin) {
                  this.players[this.assassin].points = this.players[this.king].points;
                  this.players[this.king].points = Math.ceil(this.players[this.king].points / 2); // round up because the new king is generous
              };
          });
          this.kingDownvoted.forEach(userId => {
              if (userId === this.assassin) {
                  this.players[this.assassin].points = 0;
                  this.players[this.king].points += 3;
              };
          });
      };
      Object.keys(this.players).forEach((player) => { // loop to determine the winner by destructuring object into array of keys
          if (kingTracker < this.players[player].points) { // ERROR: If all players have no points then the server crashes.
              rebel = king; // set the previous king to the new rebel
              rebelTracker = kingTracker;
              king = player; // set the new king
              kingTracker = this.players[player].points;
          } else if (rebelTracker < this.players[player].points) {
              rebel = player;
              rebelTracker = this.players[player].points;
          };
      });
      return new Round(this.players, king, rebel);
  }
}

export default Round