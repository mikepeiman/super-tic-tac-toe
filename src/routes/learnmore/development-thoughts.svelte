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
  });
</script>

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

    <div class="learnmore-sidemenu-wrapper">
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
        class="button side-menu active"
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
  <div class="game-info">
    <div class="text-content">

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
        <div class="text-content">

          <ul>
            <li>Incremental point bonuses and other scoring variations</li>
            <li>A range of gameplay features, too numerous to list here....</li>
            <li>Save and load games via local file system</li>
            <li>User authentication/login, save games and profile to DB</li>
            <li>Make solid mobile layout (currently designed for desktop)</li>
            <li>
              MULTI-DEVICE PLAY! Yes, making this a real multiplayer game, where
              you can set a lobby name and have friends join from their devices.
            </li>
            <li>Publish in the app stores.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
