<script>
  import { onMount, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import {
    storeSettings,
    storeState,
    storePlayers,
    storePlayersScored,
    storeCurrentPlayer,
    storeDirectionArrays,
    storeGameInProgress,
    storeGameHistoryTurns,
    storePreservePlayerDetails,
    storeGameHistoryFlat,
    storeButtonStyles,
    storeFinalTurnCompleted
  } from "../stores.js";

  import Fa from "sveltejs-fontawesome";
  // import { faAbacus } from "js/all.js"

  let players,
    lines,
    settings,
    buttonStyles,
    _color,
    _secondaryColor,
    _secondaryOpacity;

  onMount(() => {
    storeSettings.subscribe(value => {
      settings = value;
    });
    storeDirectionArrays.subscribe(val => {
      lines = val;
    });
    storePlayers.subscribe(val => {
      players = val;
      // console.log(`CountPoints => storePlayers.subscribe ||| YES assigned! length: ${players.length}`)
    });
    let gameInProgress = localStorage.getItem("gameInProgress");
    if ($storeFinalTurnCompleted == true) {
      countPoints();
    }
    if (gameInProgress) {
      lines = JSON.parse(localStorage.getItem("lines"));
    }
    console.log(`CountPoints onMount(), players, settings`, players, settings);
    storeButtonStyles.subscribe(val => {
      buttonStyles = val;
      ({ _color, _secondaryColor, _secondaryOpacity } = buttonStyles);
      console.log(
        `countpoints, buttonstyles from store, color ${_color} secondaryColor ${_secondaryColor} length ${val.length}`,
        val
      );
    });
  });

  function countPoints() {
    storePreservePlayerDetails.set(true);
    // let settings = JSON.parse(localStorage.getItem('settings'))
    console.log(
      "*************__________countPoints called________**************, settings, lines ",
      settings,
      lines
    );
    // console.log(
    //   "players from countPoints before checking localStorage: ",
    //   players
    // );
    if (localStorage.getItem("gameHistoryFlat")) {
      let gh = JSON.parse(localStorage.getItem("gameHistoryFlat"));
      // players = JSON.parse(localStorage.getItem("players"))
      players = $storePlayers;
      console.log(
        `countPoints, gameHistoryFlat from LS, players from $storePlayers `,
        gh,
        players
      );
    }
    console.log(
      `countPoints, gameHistoryFlat does not exist, players `,
      players
    );
    players.forEach(player => {
      // console.log(`CountPoints => players.forEach player, lines: `, lines);
      player.scores.forEach((direction, index) => {
        // console.log(
        //   `||| player ||| ${player.name} |||.scores.forEach direction.name and index: ${direction.name}, ${index} !!!!!!!!!!!!!!!!!!!!!!!!!!`,
        //   direction
        // );
        let thisScore = score(settings, direction, player, index);
        // console.log(
        //   `\n\n!!!!!! POINTS ${thisScore.points} + ${thisScore.bonus} !!!!!!!!!!!!!!!!!!!!!!!!!!\n`,
        //   thisScore,
        //   `\n`
        // );
        player["dirScoresByIndex"][index] = thisScore.points + thisScore.bonus;
        player["dirPointsByIndex"][index] = thisScore.points;
        player["dirBonusesByIndex"][index] = thisScore.bonus;
        player["scores"][index]["dirScore"] =
          thisScore.points + thisScore.bonus;
        player["scores"][index]["dirPoints"] = thisScore.points;
        player["scores"][index]["dirBonus"] = thisScore.bonus;
        let totalScore = player["dirScoresByIndex"].reduce((a, b) => a + b, 0);
        player["totalScore"] = totalScore;
        // localStorage.setItem(
        //   `${direction.name}`,
        //   JSON.stringify(lines[direction.name])
        // );
      });
    });
    players = players;
    storePlayers.set(players);
    // setTimeout(() => {
    storePlayersScored.set(true);
    // }, 10);

    // localStorage.setItem(`players`, JSON.stringify(players));
    dispatch("playersScored", players);
  }

  function score(settings, direction, player, idx) {
    let dirLines = [];
    let dirScore = 0;
    let directionScores = {};
    let dirPoints = 0;
    let dirBonus = 0;
    let name = direction.name;
    // console.log(
    //   `DIRECTION SCORING:::   ${name}   :::PLAYER:::   ${player.name} and lines`,
    //   player,
    //   lines
    // );

    direction.lines.forEach((line, index) => {
      // console.log(`each line ${index}`, line);
      let countInLine = 0;
      let countInLoop = 0;
      let points = 0;
      let bonusPoints = 0;

      let rows = settings.rows;
      let columns = settings.columns;
      // console.log(`||||| score(settings, direction, player, idx) |||||| inside of scoring function, settings rows ${rows} columns ${columns}`)
      let bonusForCompleteLine = settings.bonusForCompleteLine;
      let longerDimension = rows > columns ? rows : columns;
      let shorterDimension = rows < columns ? rows : columns;
      let len = line.length;
      // console.log(`longerDimensions in scorePoints(): rows ${rows} columns ${columns} larger ${longerDimension}. Line length ${len}`)
      // console.log(` -*-*-*-*-*-*-* ${direction.name} Line length ${len}, bonus set: ${bonusForCompleteLine}`)
      let equalSides = rows === columns ? rows : false;
      // console.log(`has equal sides? ${equalSides}`)
      let lineBonus = bonusForCompleteLine;
      if (len >= longerDimension) {
        lineBonus = bonusForCompleteLine;
        // console.log(`THIS LINE ${direction.name} ${line} ---------------------- meets or exceeds LONGER ------------------------ ****************** ${lineBonus}`)
      } else if (len >= shorterDimension) {
        lineBonus = Math.ceil(
          bonusForCompleteLine / (longerDimension / shorterDimension)
        );
        // console.log(`THIS LINE ${direction.name} ${line} ---------------------- meets or exceeds SHORTER ------------------------ ****************** ${lineBonus}`)
      } else {
        lineBonus = 0;
        // console.log(`THIS LINE ${direction.name} ${line} ---------------------- is NOT LONG ENOUGH FOR BONUS ------------------------ ****************** ${lineBonus}`)
      }
      line.forEach(move => {
        // console.log(`scoring ${move.id}`);
        let p = move.player;
        // console.log(`scoring p = move.player, `, p.name);
        if (localStorage.getItem("gameHistoryFlat")) {
          let gh = JSON.parse(localStorage.getItem("gameHistoryFlat"));
          p = getPlayerFromCellInGameHistory(gh, move.id);
        }

        if (p) {
          // console.log(`scoring p = getPlayerFromCellInGameHistory, `, p);
          // console.log(
          //   `there is a p = getPlayerFromCellInGameHistory(${move.id})`
          // );
          if (p.name !== "none" && p.id === player.id) {
            countInLoop++;
            // console.log(`${move.id} count: ${countInLoop}`);
          }
          if (p.id !== player.id) {
            lineBonus = 0;
            // console.log(
            //   `${move.id} !== player.id ${player.id}: ${countInLoop}`
            // );
            if (countInLoop >= settings.cellsToScore) {
              points += countInLoop - (settings.cellsToScore - 1);
              // console.log(`${move.id} points: ${points}`);
            }
            countInLine += countInLoop;
            countInLoop = 0;
          }
        } else {
          lineBonus = 0;
          if (countInLoop >= settings.cellsToScore) {
            points += countInLoop - (settings.cellsToScore - 1);
            // console.log(`Was undefined, but we scored points: ${move.id} points: ${points}`);
          }
          countInLine += countInLoop;
          countInLoop = 0;
        }
      });
      if (countInLoop >= settings.cellsToScore) {
        points += countInLoop - (settings.cellsToScore - 1);
      }

      dirPoints += points;
      bonusPoints += lineBonus;
      dirScore += points + lineBonus;
      dirBonus += bonusPoints;
      dirLines.push({ countInLine: countInLine, points: points });

      // console.log(`dirLines `, dirLines)
      // console.log(
      //   `:::   ${player.name} points: ${points}, dirPoints ${dirPoints}, bonus points ${bonusPoints}, dir bonus ${dirBonus}`
      // );
      // console.log(
      //   `:::   ${player.name} score for direction ${direction.name}: ${dirScore}`
      // );
    });
    player["dirLines"] = dirLines;
    players = players;
    // console.log(
    //   `DIRECTION ${direction.name} score closing with direction score ${dirScore} | player: `,
    //   player
    // );

    directionScores = { points: dirPoints, bonus: dirBonus };
    return directionScores;
  }

  function getPlayerFromCellInGameHistory(gh, id) {
    // let gh = JSON.parse(localStorage.getItem("gameHistoryFlat"))
    // console.log(`getPlayerFromCellInGameHistory for ${id}, gameHistoryFlat `, gh);
    let payload;
    let len = gh.length;
    for (let i = 0; i < len; i++) {
      let move = gh[i];
      // console.log(`getPlayerFromCellInGameHistory FOR-LOOP for ${id}, move `, move);
      if (move.id == id) {
        // console.log(
        //   `getPlayerFromCellInGameHistory -----------MATCH-------------- `
        // );
        payload = move.player;
        // console.log(
        //   `: : : : : : : : : :  PAYLOAD  : : : : : : : : : `,
        //   payload
        // );
      }
    }

    return payload;
  }
</script>

<style lang="scss">
  #tally-game-button {
  }
</style>

<button class="control-button" id="tally-game-button" on:click={countPoints}>
  <!-- <Fa
    icon={faAbacus}
    color={_color}
    secondaryColor={_secondaryColor}
    secondaryOpacity={_secondaryOpacity} /> -->
  <div class="button-text">Tally Scores</div>
</button>
