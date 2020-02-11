<script>
  import { onMount } from "svelte";
  import * as animateScroll from "svelte-scrollto";
  import LearnMoreSideMenu from "./../../components/LearnMoreSideMenu.svelte";
  import LearnMoreTopMenu from "./../../components/LearnMoreTopMenu.svelte";
  import InstructionsMenu from "./../../components/InstructionsMenu.svelte";
  // import Typewriter from "typewriter-effect/dist/core";
  // import getRandomInteger from "./../../utils/get-random-integer.js";
  import { send, receive } from "./../../crossfade.js";
  import { fade } from "svelte/transition";
  import Fa from "sveltejs-fontawesome";
  import { faMedal } from "@fortawesome/pro-solid-svg-icons";
  import { faLightbulbOn } from "@fortawesome/pro-solid-svg-icons";
  import { faUsersCrown } from "@fortawesome/pro-solid-svg-icons";
  import { faSwords } from "@fortawesome/pro-solid-svg-icons";
  import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons";
  import { faConstruction } from "@fortawesome/pro-solid-svg-icons";

  let log1 = (console.todo = function(msg) {
    console.log(
      ` %c%s%s%s`,
      `color: darkorange; background-color: black;`,
      `–`,
      msg,
      `–`
    );
  });
  onMount(async () => {
    let body = document.getElementsByTagName("body");
    console.log(`LandingPage onMount`);
    log1(`LandingPage onMount`);
  });
</script>

<style lang="scss" global>
  $input-blue: rgba(50, 200, 255, 1);
  body {
    // overflow: hidden;
  }

  #sapper {
    overflow-x: hidden;
  }
  .homepage-wrapper {
    & h1#page-title {
      top: 0;
      opacity: 1;
      z-index: 10;
      color: white;
      background: none;
      margin: 7.5vh 0 2vh 0;
      border-bottom: 6px solid $input-blue;
    }
  }
  .crossfade-wrapper {
    position: absolute;
    min-width: 100vw;
    min-height: 100vh;
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    top: 0;
    left: 0;
    padding: 0;
    margin: 0;
    & .learnmore-topmenu-wrapper,
    .learnmore-sidemenu-wrapper {
z-index: 99;
    display: -webkit-box;
    display: flex;
    justify-content: space-around;
    -webkit-box-align: start;
    align-items: flex-start;
    top: 0;
    justify-self: center;
    align-self: center;
    left: 3px;
    position: absolute;
    width: 100%;
    }
  }
  .crossfade-item {
    position: absolute;
    // transition: all 0.25s;
  }

  .learn-more-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: #1a1a1a;
    min-width: 100vw;
    min-height: 100vh;
    & .main-content {
      position: absolute;
      top: 25vh;
      justify-self: center;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    & #typewriter {
      font-size: 2rem;
      padding: 0;
      margin: 0;
    }
    & .game-info {
      position: absolute;
      left: 25vw;
      right: 25vw;
      top: 25vh;
      overflow: hidden;
      margin-right: 5vw;
    }
    & .learnmore-sidemenu-wrapper {
      position: absolute;
      left: 1rem;
      top: 25vh;
      width: 10rem;
      display: flex;
      justify-content: space-around;
      flex-direction: column;
    }
    & img {
      grid-area: content-image;
      width: 85%;
      position: relative;
      top: 1rem;
      z-index: 0;
    }

    & .button {
      padding: 1rem 2rem;
      background: #1a1a1a;
      border-radius: 5px;
      width: auto;
      text-decoration: none;
      color: $input-blue;
      border: 3px solid $input-blue;
      z-index: 9;
      transition: all 0.25s;
      &:hover {
        box-shadow: 0 0 1px 2px rgba(50, 200, 255, 0.5);
        border: 3px solid white;
        color: white;
        transition: all 0.25s;
      }
      &.side-menu {
        position: static;
        width: 15vw;
        margin: 0.75rem 1rem 0 0;
        padding: 0.75rem 1rem;
      }
      & span {
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
    }
    & h1,
    h2,
    h3,
    figure,
    & p {
      text-align: center;
      margin: 0 auto;
      color: #efefefef;
    }
    & li {
      color: #efefefef;
    }

    & h1 {
      font-size: 2.8em;
      text-transform: uppercase;
      font-weight: 700;
      margin: 0 0 0.5em 0;
    }
    & h2 {
      font-size: 2.1em;
      text-transform: uppercase;
      font-weight: 700;
      margin: 0 0 0.5em 0;
    }

    & hr {
      border: 0;
      border-bottom: 3px solid rgba(50, 200, 255, 1);
      background: rgba(0, 0, 0, 0.5);
      margin: 2rem;
    }
    $imageW: 100vw;
    $imageH: 100vh;

    & figure {
      position: absolute;
      opacity: 1;
      display: flex;
      margin: 0;
      top: 0vh;
      left: 0;
      min-width: $imageW;
      min-height: $imageH;
      width: $imageW;
      height: 100%;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
      z-index: 0;
      &#bg-from-landing-page {
        opacity: 0;
        z-index: -1;
      }
      &#bg-light-fade-in {
        z-index: 9;
      }
      &::before {
        content: "";
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        min-width: $imageW;
        min-height: $imageH;
        width: $imageW;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        outline: 2px solid #32c8ff;
        outline-offset: -10px;
      }

      & figcaption {
        margin: -2.25rem 0 2rem 0;
        padding: 0;
        z-index: 9;
        color: #555;
        visibility: hidden;
      }
    }
  }
  #final-button {
    box-shadow: 0 0 3px 4px rgba(50, 200, 255, 0.25);
    margin: 1rem 0 5rem 0;
    &:hover {
      box-shadow: 0 0 4px 5px rgba(50, 200, 255, 0.5);
      transition: all 0.45s;
    }
  }

  #play-now,
  #learn-more {
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.45s;
    z-index: 10;
  }
  #home {
    left: 2rem;
    top: 2rem;
  }
  #page-title {
    top: 2rem;
    z-index: 9;
    border-bottom: 3px solid rgba(50, 200, 255, 1);
  }
  #play-now {
    right: 2rem;
    top: 2rem;
  }

  #learn-more {
    top: 60%;
  }

  .two-columns {
    display: grid;
    grid-template-columns: 40vw 40vw;
  }
  .text-content {
    grid-area: text;
    max-width: 80vw;
    color: #abc;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    // border-radius: 10px;
    // background: black;
  }

  .learnmore-sidemenu-wrapper a {
    & .icon {
      display: flex;
      display: grid;
      grid-template-areas: "content-icon content-text";
      grid-template-columns: 3rem 1fr;
      justify-content: flex-start;
      align-items: center;
      font-size: 1rem;
      & svg {
        grid-area: content-icon;
        font-size: 2rem;
        margin-right: 1rem;
      }
      & div {
        grid-area: content-text;
      }
    }
  }
  .landing-page-wrapper {
    & #home {
      left: 2rem;
      top: 2rem;
    }
    & #page-title {
      top: 2rem;
      z-index: 9;
      border-bottom: 3px solid rgba(50, 200, 255, 1);
    }
    & #play-now {
      top: 40%;
      right: auto;
      left: auto;
    }

    & #learn-more {
      top: 60%;
      right: auto;
      left: auto;
    }
  }

  main.instructions {
    display: flex;
    flex-direction: column;
    // position: absolute;
    max-width: 60vw;
    margin: 20vh 0 5vh 0;
    z-index: 99;
    background: #33aa;
  }

  @media (max-width: 600px) {
  }

  @media (min-width: 960px) {
  }
</style>

<div class="learn-more-wrapper">

  <div class="crossfade-wrapper">
    <LearnMoreTopMenu />

    <figure
      id="bg-from-landing-page"
      out:send={{ key: 'bg-from-landing-page' }}
      in:receive={{ key: 'bg-from-landing-page' }}>
      <img
        id="tictactoe-game"
        alt="A screenshot of a completed game of Super Tic Tac Toe"
        src="game-dark-2pl.png" />
      <!-- <figcaption>A screenshot of a completed game</figcaption> -->
    </figure>
    <figure
      id="bg-light-fade-in"
      out:send={{ key: 'bg-light-fade-in' }}
      in:receive={{ key: 'bg-light-fade-in' }}>
      <img
        id="tictactoe-game"
        alt="A screenshot of a completed game of Super Tic Tac Toe"
        src="game-light-2pl.png" />
      <!-- <figcaption>A screenshot of a completed game</figcaption> -->
    </figure>

    <!-- <div in:fade="{{duration: 200}}" out:fade="{{duration: 200 }}" class="main-content">
      <p id="typewriter" />
    </div> -->
    <div
      in:fade={{ duration: 200 }}
      out:fade={{ duration: 200 }}
      class="main-content">
      <h1>INSTRUCTIONS</h1>
    </div>

    <InstructionsMenu />
    <LearnMoreSideMenu />
    <main class="instructions">
      <section class="instructions-section">
        <h1
          out:send={{ key: 'how-to-win' }}
          in:receive={{ key: 'how-to-win' }}
          class="heading">
          How To Win
        </h1>
        <div
          class="text-content"
          out:send={{ key: 'main-content' }}
          in:receive={{ key: 'main-content' }}>
          <h3>
            <span class="nice">Score the most points! Easy, right?</span>
          </h3>
        </div>
      </section>
      <section class="instructions-section">

        <h2
          class="heading"
          out:send={{ key: 'how-to-play' }}
          in:receive={{ key: 'how-to-play' }}>
          HOW TO PLAY:
        </h2>
        <div
          class="text-content"
          out:send={{ key: 'main-content' }}
          in:receive={{ key: 'main-content' }}>
          <ol>
            <li>Set your game settings (# of players, cells to score, etc)</li>
            <li>
              Set your player names and chosen marks (single ASCII character)
            </li>
            <li>
              Play! You'll get visual indications for turns remaining and turn
              changeovers
            </li>
            <li>
              See your current score anytime with the "Tally Scores" button, or
              wait until the game is done to see who is the champion!
            </li>
          </ol>
        </div>
      </section>
      <section class="instructions-section">

        <h2
          out:send={{ key: 'ui-and-features' }}
          in:receive={{ key: 'ui-and-features' }}
          class="heading">
          FEATURES:
        </h2>
        <div
          class="text-content"
          out:send={{ key: 'main-content' }}
          in:receive={{ key: 'main-content' }}>
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
                  points. For example, a line bonus of 15 on a 10x15 board means
                  the longer line bonus = 15 while the shorter line bonus = 10.
                </li>
              </ul>
            </li>
            <li>Player names and move-marks selected by players</li>
            <li>
              Score the game at any point, as often as you like - you can even
              change the moves-in-row or line bonus settings and see what the
              scores would be!
            </li>
          </ul>
        </div>
      </section>
      <section class="instructions-section">

        <h2
          class="heading"
          out:send={{ key: 'issues-and-gotchas' }}
          in:receive={{ key: 'issues-and-gotchas' }}>
          GOTCHA'S / ISSUES
        </h2>

        <div
          class="text-content"
          out:send={{ key: 'main-content' }}
          in:receive={{ key: 'main-content' }}>
          <p>Actually, it all works surprisingly well.</p>
          <p>
            <span class="note">
              If you run into issues, reload, and if it breaks, clear
              localStorage and reload.
            </span>
          </p>
          <ul>
            <li>
              You can change number of players on-the-fly, but that obviously
              messes with the scoring. Likewise with rows and columns. These
              functions are surprisingly resilient though, and you can actually
              maintain some semblence of continuity depending on your
              adjustments.
              <p>
                <span class="note">
                  TL;DR: Be careful not to change players, rows, columns on the
                  fly!
                </span>
              </p>
            </li>
            <li>
              <span class="cool">
                Cool feature! ~ You
                <span class="bold">CAN</span>
                change the number-of-moves-in-a-row-to-score, and the line bonus
                on the fly and recalculate scoring!
              </span>
              We've discovered that there definitely are different winning
              strategies based on different settings.
            </li>
          </ul>
        </div>
      </section>
      <section class="instructions-section">
        <div
          class="text-content"
          out:send={{ key: 'main-content' }}
          in:receive={{ key: 'main-content' }}>
          <h2
            class="heading"
            out:send={{ key: 'development-thoughts' }}
            in:receive={{ key: 'development-thoughts' }}>
            DEVELOPMENT (tentative roadmap):
          </h2>
          <section class="instructions-section">
            <ul>
              <li>Incremental point bonuses and other scoring variations</li>
              <li>
                A range of gameplay features, too numerous to list here....
              </li>
              <li>Save and load games via local file system</li>
              <li>User authentication/login, save games and profile to DB</li>
              <li>Make solid mobile layout (currently designed for desktop)</li>
              <li>
                MULTI-DEVICE PLAY! Yes, making this a real multiplayer game,
                where you can set a lobby name and have friends join from their
                devices.
              </li>
              <li>Publish in the app stores.</li>
            </ul>
          </section>
        </div>
      </section>
    </main>

  </div>
  <div class="game-info" />
</div>
