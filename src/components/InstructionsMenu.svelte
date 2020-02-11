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
      `color: white; background-color: rgba(55,75,155,1);`,
      `–`,
      msg,
      `–`
    );
  });
  onMount(async () => {
    // let body = document.getElementsByTagName("body");
    log1(`InstructionsMenu onMount`);

    let mainNavLinks = document.querySelectorAll("nav ul li a");
    let mainSections = document.querySelectorAll("main section");
    let lastId;
    let cur = [];

    // This should probably be throttled.
    // Especially because it triggers during smooth scrolling.
    // https://lodash.com/docs/4.17.10#throttle
    // You could do like...
    // window.addEventListener("scroll", () => {
    //    _.throttle(doThatStuff, 100);
    // });
    // Only not doing it here to keep this Pen dependency-free.

    window.addEventListener("scroll", event => {
      let fromTop = window.scrollY;

      mainNavLinks.forEach(link => {
        let section = document.querySelector(link.hash);

        if (
          section.offsetTop <= fromTop &&
          section.offsetTop + section.offsetHeight > fromTop
        ) {
          link.classList.add("current");
        } else {
          link.classList.remove("current");
        }
      });
    });
  });
</script>

<style lang="scss">
  .instructions-menu-wrapper {
    display: -webkit-box;
    display: flex;
    justify-content: space-around;
    top: 16vh;
    position: absolute;
  }

  .button.side-menu .icon {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 10rem;
    & div {
      margin-left: 1rem;
    }
  }
</style>

<div class="instructions-menu-wrapper">
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
        secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%, 1)" />
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
        secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%, 1)" />
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
        secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%, 1)" />
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
        secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%, 1)" />
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
        secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%, 1)" />
      <div>Development</div>
    </div>
  </a>
</div>
