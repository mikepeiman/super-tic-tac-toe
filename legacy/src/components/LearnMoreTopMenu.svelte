<script>
  import { onMount } from "svelte";
  // import Typewriter from "typewriter-effect/dist/core";
  // import getRandomInteger from "./../../utils/get-random-integer.js";
  import { send, receive } from "./../crossfade.js";
  import { fade } from "svelte/transition";
  import Fa from "sveltejs-fontawesome";
  // import { faMedal } from "js/all.js"
  // import { faLightbulbOn } from "js/all.js"
  // import { faUsersCrown } from "js/all.js"
  // import { faSwords } from "js/all.js"
  // import { faExclamationTriangle } from "js/all.js"
  // import { faConstruction } from "js/all.js"
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

<style lang="scss">
  .learnmore-topmenu-wrapper {
    grid-area: topbar;
    height: 10vh;
    background: black;
    & #page-title {
      // left: 1rem;
      top: 1rem;
      font-size: 1.75rem;
      font-weight: 100;
      border-bottom: 3px solid rgba(0, 0, 0, 0);
    }
    & #play-now {
      top: 1rem;
      border: 3px solid #32c8ff;
    }
    & #home {
      top: 1rem;
      left: 1rem;
      border: 3px solid #32c8ff;
    }
  }

  @media screen and (max-width: 600px) {
    .crossfade-wrapper .learnmore-topmenu-wrapper #page-title {
      top: 1.5rem;
      font-size: 1.25rem;
    }
  }

  @media screen and (max-height: 600px) {
    .learn-more-wrapper {
      & .learnmore-topmenu-wrapper {
        & #home,
        #play-now {
          top: 0.5rem;
          padding: 0.25rem;
          border: 1px solid #32c8ff;
          font-size: 0.75rem;
        }
        & #home {
          left: 1rem;
        }
        & #play-now {
          right: 2rem;
        }
        & h1#page-title {
          top: 0.35rem;
          font-size: 1.5rem;
        }
      }
    }
  }
</style>

<div class="learnmore-topmenu-wrapper">
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
</div>
