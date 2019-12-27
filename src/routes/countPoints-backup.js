  function saveGame() {
    localStorage.setItem('savedGame', JSON.stringify({ "gameboard": gameboardMapped, "players": scoredPlayers }))
    let test = localStorage.getItem('savedGame')
    console.log('saveGame calling LS: ')
    console.log(JSON.parse(test))
  }

    function score(direction, player, idx) {
    // $: cellsToScore
    console.log(
      `score called with direction and player and idx ${idx}`,
      direction,
      player
    );

    let dirLines = [];
    let dirScore = 0;
    let name = direction.name;

    direction.lines.forEach((line, index) => {
      let countInLine = 0;
      let countInLoop = 0;
      let points = 0;
      line.forEach(move => {
        console.log(`scoring ${move.id}`, move);
        let p = getPlayerFromCell(move.id);
        console.log(`scoring p = getPlayerFromCell, `, p)
        // move.player = {
        //   name: p.name,
        //   id: p.id
        // };
        if (p.name !== "none" && p.id === player.id) {
          countInLoop++;
        }
        if (p.id !== player.id) {
          if (countInLoop >= cellsToScore) {
            points += countInLoop - (cellsToScore - 1);
          }
          countInLine += countInLoop;
          countInLoop = 0;
        }
      });
      if (countInLoop >= cellsToScore) {
        points += countInLoop - (cellsToScore - 1);
      }
      dirLines.push({ countInLine: countInLine, points: points });
      // console.log(`dirLines `, dirLines)
      dirScore += points;
    });
    // console.log(`score closing with direction score ${dirScore} | ${direction.dirScore}`, direction);
    // direction.dirScore = dirScore
    // console.log(`score closing with direction score ${dirScore} | ${direction.dirScore}`, direction);
    scoredPlayers = scoredPlayers;
    // console.log(`score closing with direction score ${dirScore} | ${direction.dirScore}`, direction);
    console.log(
      `score closing with direction score ${dirScore} | player: `,
      player
    );
    console.log(
      `player.scores[idx] ${idx} .dirScore: `,
      player.scores[idx].dirScore
    );
    // player.scores[idx].dirScore = dirScore
    // player.scores[idx].dirLines = dirLines
    return dirScore;
  }
