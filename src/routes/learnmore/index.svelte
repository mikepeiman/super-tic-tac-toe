<script>
  import { onMount } from "svelte";
  import Typewriter from "typewriter-effect/dist/core";
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
    console.log(`LandingPage onMount`);
    log1(`LandingPage onMount`);
    let typewriter = new Typewriter("#typewriter", {
      autoStart: true,
      loop: true
    });
let msg1 = 'Here be thy instructions -'
let msg2 = 'Ignore them at your peril!'
let msg3 = '...   Score the most points to win!'
let msg4 = ''

    typewriter
    .changeDeleteSpeed(25)
    .changeDelay(50)
      .pauseFor(1000)
      .typeString(msg1)
      .pauseFor(2000)
      .deleteAll()
      .typeString(msg2)
      .pauseFor(2000)
      .deleteAll()
      .typeString(msg3)
      .pauseFor(2000)
      .deleteAll()
      .typeString("Click a button to the left to learn more.")
      .pauseFor(2000)
      .start();
    // tw().changeDeleteSpeed(15).changeDelay(25)
    // tw.typeString('Instructions')
    //   .pauseFor(2500)
    //   .deleteAll()
    //   .typeString('(go ahead, click a button for more info...)')
    //   .pauseFor(1000)
    //   .deleteAll();
  });
</script>

<style lang="scss" global>
  $input-blue: rgba(50, 200, 255, 1);

  :global(#sapper) {
    overflow-x: hidden;
  }
  :global(.homepage-wrapper) {
    & h1.page-title {
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
  }
  .crossfade-item {
    position: absolute;
    // transition: all 0.25s;
  }

  $imageW: 25vw;
  $imageH: 25vh;

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
    & .side-menu-wrapper {
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

    & figure {
      position: relative;
      opacity: 0;
      display: flex;
      margin: 0;
      top: 0;
      left: 0;
      min-width: $imageW;
      min-height: $imageH;
      width: $imageW;
      height: $imageH;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
      z-index: 0;
      &::before {
        content: "";
        position: absolute;
        z-index: 0;
        top: 0;
        left: 0;
        min-width: $imageW;
        min-height: $imageH;
        width: $imageW;
        height: $imageH;
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

  // span {
  //   background: rgba(119, 94, 94, 0.25);
  //   font-weight: 300;
  //   padding: 0 1ch;
  //   &.nice {
  //     color: rgba(140, 255, 140, 0.75);
  //   }
  //   &.note {
  //     color: rgba(255, 140, 140, 0.75);
  //   }
  //   &.cool {
  //     color: rgba(140, 140, 255, 0.75);
  //   }
  //   &.bold {
  //     font-weight: 700;
  //   }
  //   &.underline {
  //     border-bottom: 1px solidrgba(0, 0, 0, 0.75);
  //   }
  // }
  .side-menu-wrapper a {
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
      // right: 2rem;
      // top: 2rem;
    }

    & #learn-more {
      top: 60%;
    }
  }

  @media (max-width: 600px) {
  }

  @media (min-width: 960px) {
  }
</style>

<div class="learn-more-wrapper">

  <div class="crossfade-wrapper">
    <h1
      out:send={{ key: 'title' }}
      in:receive={{ key: 'title' }}
      class="crossfade-item page-title"
      id="page-title">

      <slot name="app-title" />
      Super Tic-Tac-Toe
    </h1>
    <a
      out:send={{ key: 'play-now' }}
      in:receive={{ key: 'play-now' }}
      rel="prefetch"
      class="crossfade-item button"
      id="play-now"
      href="tictactoe/">
      <slot name="play-now" />
      PLAY NOW!
    </a>
    <a
      out:send={{ key: 'learn-more' }}
      in:receive={{ key: 'learn-more' }}
      rel="prefetch"
      class="crossfade-item button"
      id="home"
      href="/">
      &#x21A4; Go back
    </a>
    <figure out:send={{ key: 'figure' }} in:receive={{ key: 'figure' }}>
      <img
        id="tictactoe-game"
        alt="A completed game of Super Tic Tac Toe"
        src="game-dark-2pl.png" />
      <figcaption>An example of a completed game</figcaption>

    </figure>

    <div class="main-content">
      <p id="typewriter" />
    </div>

    <div class="side-menu-wrapper">
      <a
        name="how-to-win"
        out:send={{ key: 'how-to-win' }}
        in:receive={{ key: 'how-to-win' }}
        class="button side-menu"
        id="how-to-win-button"
        href="learnmore/how-to-win">
        <div class="icon users-crown">
          <Fa
            icon={faUsersCrown}
            color="white"
            secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%,
            1)" />
          <div>How To Win</div>
        </div>
      </a>
      <a
        name="how-to-play"
        out:send={{ key: 'how-to-play' }}
        in:receive={{ key: 'how-to-play' }}
        class="button side-menu"
        id="how-to-play-button"
        href="learnmore/how-to-play/">
        <div class="icon swords">
          <Fa
            icon={faSwords}
            color="white"
            secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%,
            1)" />
          <div>How To Play</div>
        </div>
      </a>
      <a
        name="features"
        out:send={{ key: 'ui-and-features' }}
        in:receive={{ key: 'ui-and-features' }}
        class="button side-menu"
        id="ui-and-features-button"
        href="learnmore/ui-and-features/">
        <div class="icon lightbulb-on">
          <Fa
            icon={faLightbulbOn}
            color="white"
            secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%,
            1)" />
          <div>UI & Features</div>
        </div>
      </a>
      <a
        name="issues"
        out:send={{ key: 'issues-and-gotchas' }}
        in:receive={{ key: 'issues-and-gotchas' }}
        class="button side-menu"
        id="issues-and-gotchas-button"
        href="learnmore/issues-and-gotchas/">
        <div class="icon exclamation-triangle">
          <Fa
            icon={faExclamationTriangle}
            color="white"
            secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%,
            1)" />
          <div>Issues</div>
        </div>
      </a>
      <a
        name="development"
        out:send={{ key: 'development-thoughts' }}
        in:receive={{ key: 'development-thoughts' }}
        class="button side-menu"
        id="development-thoughts-button"
        href="learnmore/development-thoughts/">
        <div class="icon construction">
          <Fa
            icon={faConstruction}
            color="white"
            secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%,
            1)" />
          <div>Development</div>
        </div>
      </a>
    </div>

  </div>
  <div class="game-info" />
</div>
