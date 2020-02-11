<script>
  import { onMount } from "svelte";
  // import Typewriter from "typewriter-effect/dist/core";
  // import getRandomInteger from "./../../utils/get-random-integer.js";
  import { send, receive } from "./../crossfade.js";
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

<style lang="scss">
  .learnmore-topmenu-wrapper {
    grid-area: topbar;
    & #page-title {
      // left: 1rem;
      top: 1rem;
      font-size: 1.75rem;
      font-weight: 100;
      border-bottom: 3px solid rgba(0,0,0,0);
    }
    & #play-now {
      top: 1rem;
      border: 3px solid #32c8ff;

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
  <!-- <a
        out:send={{ key: 'learn-more' }}
        in:receive={{ key: 'learn-more' }}
        rel="prefetch"
        class="crossfade-item button"
        id="home"
        href="/">
        &#x21A4; Go back
      </a> -->
</div>
