<script>
  import { onMount, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import {
    storeSettings,
    storeState,
    storePlayers,
    storeCurrentPlayer,
    storeDirectionArrays,
    storeGameInProgress,
    storeGameHistoryTurns,
    storePreservePlayerDetails,
    storeGameHistoryFlat
  } from "../stores.js";

  export let players;

  $: lines = [];

  $: gameboardMapped = [];
  $: settings = {};

  onMount(() => {
    storeDirectionArrays.subscribe(val => {
      // console.log(
      //   `CountPoints store subscription to storeDirectionArrays: `,
      //   val
      // );
      lines = val;
    });
    settings = $storeSettings;

    let gameInProgress = localStorage.getItem("gameInProgress");
    if (gameInProgress) {
      lines = JSON.parse(localStorage.getItem("lines"));
    }
    console.log(`CountPoints onMount(), players, settings`, players, settings);
  });

  function countPoints() {
    // let settings = JSON.parse(localStorage.getItem('settings'))
    // console.log(
    //   "*************__________countPoints called________**************, settings, lines ",
    //   settings,
    //   lines
    // );
    // console.log(
    //   "players from countPoints before checking localStorage: ",
    //   players
    // );
    if (localStorage.getItem("gameHistoryFlat")) {
      let gh = JSON.parse(localStorage.getItem("gameHistoryFlat"));
      // players = JSON.parse(localStorage.getItem("players"))
      players = $storePlayers;
      // console.log(`countPoints, gameHistoryFlat from LS: `, gh);
    }

    players.forEach(player => {
      // console.log(`CountPoints => players.forEach player, lines: `, lines);
      player.scores.forEach((direction, index) => {
        // console.log(
        //   `!!!!!! player.scores.forEach direction.name and index: ${direction.name}, ${index} !!!!!!!!!!!!!!!!!!!!!!!!!!`,
        //   direction
        // );
        let thisScore = score(settings, direction, player, index);
        // console.log(`!!!!!! POINTS  ${thisScore} !!!!!!!!!!!!!!!!!!!!!!!!!!`);
        player["dirScoresByIndex"][index] = thisScore;
        player["scores"][index]["dirScore"] = thisScore;
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
    localStorage.setItem(`players`, JSON.stringify(players));
    dispatch("playersScored", players);
  }

  function score(settings, direction, player, idx) {
    let dirLines = [];
    let dirScore = 0;
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
      let rows = settings.rows;
      let columns = settings.columns;
      let bonusForCompleteRow = settings.bonusForCompleteRow;
      let longerDimension = rows > columns ? rows : columns;
      let shorterDimension = rows < columns ? rows : columns;
      let len = line.length;
      // console.log(`longerDimensions in scorePoints(): rows ${rows} columns ${columns} larger ${longerDimension}. Line length ${len}`)
      // console.log(` -*-*-*-*-*-*-*    Line length ${len}, bonus set: ${bonusForCompleteRow}`)
      let equalSides = rows === columns ? rows : false;
      // console.log(`has equal sides? ${equalSides}`)
      let lineBonus = bonusForCompleteRow;
      if (len >= longerDimension) {
        lineBonus = bonusForCompleteRow;
        // console.log(`THIS LINE ---------------------- meets or excees LONGER ------------------------ ****************** ${lineBonus}`)
      } else if (len >= shorterDimension) {
        lineBonus = Math.ceil(
          bonusForCompleteRow / (longerDimension / shorterDimension)
        );
        // console.log(`THIS LINE ---------------------- meets or excees SHORTER ------------------------ ****************** ${lineBonus}`)
      } else {
        lineBonus = 0;
        // console.log(`THIS LINE ---------------------- is NOT LONG ENOUGH FOR BONUS ------------------------ ****************** ${lineBonus}`)
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

      // console.log(`END OF LINE LOOP:::   ${player.name} points: ${points}`);
      points += lineBonus;
      // console.log(
      //   `END OF LINE LOOP:::   ${player.name} points after lineBonus ${lineBonus}: ${points}`
      // );
      dirLines.push({ countInLine: countInLine, points: points });
      // console.log(`dirLines `, dirLines)
      dirScore += points;
    });
    players = players;
    // console.log(
    //   `score closing with direction score ${dirScore} | player: `,
    //   player
    // );
    return dirScore;
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

</style>

<button class="control-button" id="tally-game-button" on:click={countPoints}>
  Tally Scores
</button>
