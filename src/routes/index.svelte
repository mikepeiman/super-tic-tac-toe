<script>
  export let segment;
</script>

<style lang="scss">
  $input-blue: rgba(50, 200, 255, 1);
  h1,
  figure,
  p {
    text-align: center;
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  figure {
    display: block;
    margin-block-start: 0;
    margin-block-end: 0;
    margin-inline-start: 0;
    margin-inline-end: 0;
  }

  // img {
  //   width: 100%;
  //   max-width: 400px;
  //   margin: 0 0 1em 0;
  // }

  .pagelink-button {
    padding: 1rem 2rem;
    background: #1a1a1a;
    border-radius: 5px;
    text-decoration: none;
    color: $input-blue;
    border: 3px solid $input-blue;
    box-shadow: 0 0 3px 3px rgba(50, 200, 255, 0.5);
  }

  p {
    margin: 1em auto;
  }
  .homepage-wrapper {
    background: #1a1a1a;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .figure-wrapper {
    display: flex;
    & img {
      height: 40vh;
    }
  }

  .two-columns {
    display: grid;
    max-width: 80vw;
    grid-template-columns: 50vw 50vw;
    margin: 0 10vw;

    // & figure {
    //   max-width: 100%;
    //   display: flex;
    //   flex-direction: column;
    //   justify-content: center;
    //   align-items: center;
    // }
    & .text-content {
      // background: #eee;
      color: #eee;
      padding: 2rem;
      margin: 2rem;
      border-radius: 10px;
    }
  }
  .three-columns {
    display: grid;
    max-width: 80vw;
    grid-template-columns: 1fr 1fr 1fr;

    & figure {
      max-width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    & .text-content {
      background: #eee;
      padding: 2rem;
      border-radius: 10px;
    }
  }
  img#scoreboard {
    width: 10vw;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>

<svelte:head>
  <title>TicTacToe - Supercharged Tic Tac Toe!</title>
</svelte:head>
<div class="homepage-wrapper">

  <h1>SUPER Tic Tac Toe!</h1>
  <a
    class="pagelink-button"
    class:selected={segment === 'tictactoe'}
    href="TicTacToe">
    PLAY NOW!
  </a>
  <div class="columns two-columns">

    <div class="text-content">
      <h2>Here's a fun, colorful upgrade to a classic game.</h2>
      <p>
        Instead of a paltry 3x3 grid, you can now make grids of any size!
        (practical limitations of screen size apply)
      </p>
      <h2>HOW TO WIN:</h2>
      <p>Score the most points! Easy, right?</p>
    </div>

    <figure class="figure-wrapper">
      <figure>
        <img
          id="scoreboard"
          alt="Scoreboard"
          src="tictactoe-players-scoreboard.png" />
        <figcaption>The score board</figcaption>
      </figure>
      <figure>
        <img
          id="gameboard"
          alt="Gameboard"
          src="tictactoe-gameboard-5-players.png" />
        <figcaption>The game board</figcaption>
      </figure>
      <figure>
        <img id="settings" alt="Settings" src="tictactoe-settings-2.png" />
        <figcaption>Game settings</figcaption>
      </figure>
    </figure>
  </div>
  <div class="columns two-columns">

    <div class="text-content">
      <h3>FEATURES:</h3>
      <ul>
        <li>Play with (theoretically) any number of players</li>
        <li>Set how many moves in a row to score</li>
        <li>Set a line bonus for scoring a complete line in any direction</li>
        <li>Player names and move-markers selected by players</li>
        <li>
          Score the game at any point, as often as you like - you can even
          change the moves-in-row or line bonus settings and see what the scores
          would be!
        </li>
        <li />
      </ul>
    </div>

  </div>

  <p>
    <strong>
      Try editing this file (src/routes/index.svelte) to test HOT reloading.
    </strong>
  </p>

</div>
