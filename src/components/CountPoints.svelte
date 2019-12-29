<script>
  import { onMount, createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

  export let players;
  // export let gameboardMapped

  $: gameboardMapped = [];

  onMount(() => {
    console.log(`CountPoints onMount(), players, gameboardMapped`);
    // console.log(players, gameboardMapped);
  });

  function countPoints() {
    console.log(
      "*************__________countPoints called________**************"
    );
    console.log(
      "players from countPoints before checking localStorage: ",
      players
    );
    // let players = JSON.parse(localStorage.getItem('players'))

    // localStorage.setItem("gameboardMapped", JSON.stringify(gameboardMapped));
    // let players = players;
    if (localStorage.getItem("players")) {
      players = JSON.parse(localStorage.getItem("players"));
      console.log("using localStorage");
    }
    console.log(
      "players from countPoints after checking localStorage, before loop: ",
      players
    );
    if (localStorage.getItem("gameboardMapped")) {
      gameboardMapped = JSON.parse(localStorage.getItem("gameboardMapped"));
      console.log("using localStorage");
    }
    console.log(
      "gameboardMapped from countPoints from localStorage before loop: ",
      gameboardMapped
    );
    players.forEach(player => {
      player.scores.forEach((direction, index) => {
        // console.log(
        //   `!!!!!! player.scores.forEach direction.name and index: ${direction.name}, ${index} !!!!!!!!!!!!!!!!!!!!!!!!!!`
        // );
        let thisScore = score(direction, player, index);
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
    localStorage.setItem(`players`, JSON.stringify(players));
    dispatch('playersScored', players)
  }

  function score(direction, player, idx) {
    // $: settings.cellsToScore
    // console.log(
    //   `score called with direction and player and idx ${idx}`,
    //   direction,
    //   player
    // );

    let dirLines = [];
    let dirScore = 0;
    let name = direction.name;
    console.log(
      `DIRECTION SCORING:::   ${name}   :::PLAYER:::   ${player.name}`
    );
    let settings = JSON.parse(localStorage.getItem("settings"));
    direction.lines.forEach((line, index) => {
      let countInLine = 0;
      let countInLoop = 0;
      let points = 0;
      line.forEach(move => {
        console.log(`scoring ${move.id}`, move);
        let p = move.player;
        console.log(`scoring p = move.player, `, p);
        p = getPlayerFromCellInGameboardMapped(move.id);
        console.log(`scoring p = getPlayerFromCellInGameboardMapped, `, p);
        // move.player = {
        //   name: p.name,
        //   id: p.id
        // };
        if (p) {
          console.log(
            `there is a p = getPlayerFromCellInGameboardMapped(${move.id})`
          );
          if (p.name !== "none" && p.id === player.id) {
            countInLoop++;
            console.log(`${move.id} count: ${countInLoop}`);
          }
          if (p.id !== player.id) {
            console.log(`${move.id} !== player.id ${player.id}: ${countInLoop}`);
            if (countInLoop >= settings.cellsToScore) {
              points += countInLoop - (settings.cellsToScore - 1);
              console.log(`${move.id} points: ${points}`);
            }
            countInLine += countInLoop;
            countInLoop = 0;
          }
        }
      });
      if (countInLoop >= settings.cellsToScore) {
        points += countInLoop - (settings.cellsToScore - 1);
      }
      console.log(`END OF LINE LOOP:::   ${player.name} points: ${points}`);
      dirLines.push({ countInLine: countInLine, points: points });
      // console.log(`dirLines `, dirLines)
      dirScore += points;
    });
    players = players;
    console.log(
      `score closing with direction score ${dirScore} | player: `,
      player
    );
    return dirScore;
  }

  function getPlayerFromCellInGameboardMapped(id) {
    let payload;
    gameboardMapped.forEach(move => {
      if (move.id == id) {
        payload = move.player;
      }
    });
    return payload;
  }
</script>

<style lang="scss">

</style>

<button class="control-button" id="tally-game-button" on:click={countPoints}>
  Tally points
</button>
