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
html {
  scroll-behavior: smooth;
}
</style>

<div class="learnmore-sidemenu-wrapper">
      <a
        name="how-to-win"
        out:send={{ key: 'how-to-win' }}
        in:receive={{ key: 'how-to-win' }}
        class="button side-menu"
        id="how-to-win-button"
        href="learnmore/how-to-win">
        <div class="icon users-crown">
          <!-- <Fa
            icon={faUsersCrown}
            color="white"
            secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%,
            1)" /> -->
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
          <!-- <Fa
            icon={faSwords}
            color="white"
            secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%,
            1)" /> -->
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
          <!-- <Fa
            icon={faLightbulbOn}
            color="white"
            secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%,
            1)" /> -->
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
          <!-- <Fa
            icon={faExclamationTriangle}
            color="white"
            secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%,
            1)" /> -->
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
          <!-- <Fa
            icon={faConstruction}
            color="white"
            secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%,
            1)" /> -->
          <div>Development</div>
        </div>
      </a>
    </div>  