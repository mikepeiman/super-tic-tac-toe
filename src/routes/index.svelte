<script>
  const emojis = require("emojis-list");
  console.log(emojis);
</script>

<style lang="scss">
  $input-blue: rgba(50, 200, 255, 1);
  h1,
  h2,
  h3,
  figure,
  p {
    text-align: center;
    margin: 0 auto;
    color: #aaa;
  }
  li {
    color: #aaa;
  }

  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }
  h2 {
    font-size: 2.1em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  hr {
    border: 0;
    border-bottom: 3px solid rgba(50, 200, 255, 1);
    background: rgba(0, 0, 0, 0.5);
    margin: 2rem;
  }

  .page-title {
    margin: 5vh 0 2vh 0;
  }

  figure {
    display: block;
    margin-block-start: 0;
    margin-block-end: 0;
    margin-inline-start: 0;
    margin-inline-end: 0;
  }

  .tictactoe-button {
    padding: 1rem 2rem;
    background: #1a1a1a;
    border-radius: 5px;
    text-decoration: none;
    color: $input-blue;
    border: 3px solid $input-blue;
    box-shadow: 0 0 30px 40px rgba(50, 200, 255, 0.25);
    &:hover {
      box-shadow: 0 0 30px 40px rgba(50, 200, 255, 0.5);
      border: 3px solid white;
      color: white;
      transition: all 0.25s;
    }
  }

  #final-button {
    box-shadow: 0 0 3px 4px rgba(50, 200, 255, 0.25);
    margin: 1rem 0 5rem 0;
    &:hover {
      box-shadow: 0 0 4px 5px rgba(50, 200, 255, 0.5);
      transition: all 0.25s;
    }
  }

  #playnow {
    position: absolute;
    top: 40%;
    left: calc(50% - (2rem + 5.5ch));
    transition: all 0.25s;
    z-index: 10;
  }
  img {
    max-width: 100vw;
    width: 100vw;
    position: relative;
  }

  figure {
    position: relative;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      // background-image: radial-gradient(rgba(0,0,0, 0.5), rgba(0,0,0,0));
    }

    & figcaption {
      margin: -0.5rem 0 2rem 0;
      padding: 0;
    }
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

  .two-columns {
    display: grid;
    grid-template-columns: 40vw 40vw;
  }
  .text-content {
    max-width: 80vw;
    color: #abc;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    // border-radius: 10px;
    // background: black;
  }

  .game-info {
    margin: 2rem 0 0 0;
  }

  span {
    background: rgba(119, 94, 94, 0.25);
    font-weight: 300;
    padding: 0 1ch;
    &.nice {
      color: rgba(140, 255, 140, 0.75);
    }
    &.note {
      color: rgba(255, 140, 140, 0.75);
    }
    &.cool {
      color: rgba(140, 140, 255, 0.75);
    }
    &.bold {
      font-weight: 700;
    }
    &.underline {
      border-bottom: 1px solidrgba(0, 0, 0, 0.75);
    }
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 3.2em;
    }
    h1 {
      font-size: 2.8em;
    }
    img {
      max-width: 90vw;
      width: 90vw;
      position: relative;
    }
  }

  @media (min-width: 960px) {
    h1 {
      font-size: 4em;
    }
    h2 {
      font-size: 3.2em;
    }
    img {
      max-width: 80vw;
      width: 80vw;
      position: relative;
    }
    .text-content {
      max-width: 60vw;
    }
  }
</style>

<svelte:head>
  <title>TicTacToe - Supercharged Tic Tac Toe!</title>
</svelte:head>
<div class="homepage-wrapper">

  <h1 class="page-title">SUPER Tic Tac Toe!</h1>

  <figure>
    <img
      id="tictactoe-game"
      alt="A completed game of Super Tic Tac Toe"
      src="tictactoe-homepage.jpg" />
    <figcaption>An example of a completed game</figcaption>
    <a
      segment
      rel="prefetch"
      class="tictactoe-button"
      id="playnow"
      href="tictactoe/">
      PLAY NOW!
    </a>
  </figure>

  <div class="game-info">
    <div class="text-content">
      <h2>WELCOME!</h2>
      <p>
        "Super Tic Tac Toe" is a fun, colorful upgrade to a classic game:
        instead of a paltry 3x3 grid, you can now make grids of any size! (well,
        at least whatever will fit on your screen...)
      </p>
      <p>
        This game is made by myself - Mike Peiman - and playtested with love by
        my six-year-old daughter and other family and friends. Coded from
        scratch in Svelte/Sapper, with zero style libraries.
      </p>
      <span class="note">
        NOTE: The site is currently optimized for desktop; responsive design in
        progress (try landscape mode if you're on your phone)
      </span>
    </div>

    <hr />

    <div class="text-content">
      <h2>HOW TO WIN:</h2>
      <h3>
        <span class="nice">Score the most points! Easy, right?</span>
      </h3>
    </div>

    <hr />

    <div class="text-content">

      <h2>HOW TO PLAY:</h2>
      <ol>
        <li>Set your game settings (# of players, cells to score, etc)</li>
        <li>Set your player names and chosen marks (single ASCII character)</li>
        <li>
          Play! You'll get visual indications for turns remaining and turn
          changeovers
        </li>
        <li>
          See your current score anytime with the "Tally Scores" button, or wait
          until the game is done to see who is the champion!
        </li>
      </ol>
    </div>

    <hr />

    <div class="text-content">
      <h2>FEATURES:</h2>
      <ul>
        <li>Play with (theoretically) any number of players</li>
        <li>Set how many moves in a row to score</li>
        <li>
          Set a line bonus for scoring a complete line in any direction
          <ul>
            <li>
              <span class="note">
                NOTE: the full bonus only applies to the longer side if the
                board is asymmetrical.
              </span>
              Shorter side and diagonals receive (bonus / (long / short))
              points. For example, a line bonus of 15 on a 10x15 board means the
              longer line bonus = 15 while the shorter line bonus = 10.
            </li>
          </ul>
        </li>
        <li>Player names and move-markers selected by players</li>
        <li>
          Score the game at any point, as often as you like - you can even
          change the moves-in-row or line bonus settings and see what the scores
          would be!
        </li>
      </ul>
    </div>

    <hr />

    <div class="text-content">
      <h2>GOTCHA'S / ISSUES</h2>
      <p>Actually, it all works surprisingly well.</p>
      <p>
        <span class="note">
          If you run into issues, reload, and if it breaks, clear localStorage
          and reload.
        </span>
      </p>
      <ul>
        <li>
          You can change number of players on-the-fly, but that obviously messes
          with the scoring. Likewise with rows and columns. These functions are
          surprisingly resilient though, and you can actually maintain some
          semblence of continuity depending on your adjustments.
          <p>
            <span class="note">
              TL;DR: Be careful not to change players, rows, columns on the fly!
            </span>
          </p>
        </li>
        <li>
          <span class="cool">
            Cool feature! ~ You
            <span class="bold">CAN</span>
            change the number-of-moves-in-a-row-to-score, and the line bonus on
            the fly and recalculate scoring!
          </span>
          We've discovered that there definitely are different winning
          strategies based on different settings.
        </li>
      </ul>
    </div>

    <hr />

    <div class="text-content">
      <h2>DEVELOPMENT (tentative roadmap):</h2>
      <ul>
        <li>Incremental point bonuses and other scoring variations</li>
        <li>A range of gameplay features, too numerous to list here....</li>
        <li>Save and load games via local file system</li>
        <li>User authentication/login, save games and profile to DB</li>
        <li>Make solid mobile layout (currently designed for desktop)</li>
        <li>
          MULTI-DEVICE PLAY! Yes, making this a real multiplayer game, where you
          can set a lobby name and have friends join from their devices.
        </li>
        <li>Publish in the app stores.</li>
      </ul>
    </div>

    <hr />

    <div class="text-content">
      <h2>Go on, play already...!</h2>
      <a segment class="tictactoe-button" id="final-button" href="tictactoe/">
        PLAY NOW!
      </a>
    </div>
  </div>
</div>
