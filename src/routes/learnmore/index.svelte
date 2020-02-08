<script>
  import { onMount } from "svelte";
  import LearnMoreSideMenu from "./../../components/LearnMoreSideMenu.svelte";
  import LearnMoreTopMenu from "./../../components/LearnMoreTopMenu.svelte";
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
      display: flex;
      justify-content: space-around;
      -webkit-box-align: start;
      align-items: flex-start;
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
      height: $imageH;
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

    <LearnMoreSideMenu />

  </div>
  <div class="game-info" />
</div>
