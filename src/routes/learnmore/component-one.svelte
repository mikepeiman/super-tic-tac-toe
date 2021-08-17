<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { send, receive } from "./../../crossfade.js";
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
    console.log(`component-one onMount`);
    log1(`component-one onMount`);
  });
</script>

<style lang="scss">
  $input-blue: rgba(50, 200, 255, 1);
  .wrapper-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 100vw;
    min-height: 100vh;
    background: #1a1a1a;
  }
  .content-wrapper {
    position: absolute;
    display: flex;
    background: #1a1a1a;
    // width: 100vw;
    // height: 100vh;
  }
  .button {
    position: relative;
    height: 100px;
    width: 20rem;
    padding: 1rem 2rem;
    background: #1a1afa;
    border-radius: 5px;
    text-decoration: none;
    color: $input-blue;
    border: 3px solid $input-blue;
    z-index: 99;
    box-shadow: 0 0 5px 10px rgba(50, 200, 255, 0.25);
    &:hover {
      box-shadow: 0 0 10px 20px rgba(50, 200, 255, 0.5);
      border: 3px solid white;
      color: white;
      transition: all 0.45s;
    }
    &.heading {
      bottom: 0;
    }
  }

  .button2 {
    background: #00ccfa;
    color: black;
    top: 10vh;
    box-shadow: 0 0 5px 10px rgba(50, 200, 255, 0.25);
    right: 10vw;
  }
</style>

<div class="wrapper-wrapper">

  <div class="content-wrapper">
    <h1
      out:send={{ key: 'h1' }}
      in:receive={{ key: 'h1' }}
      class="button heading">
      Currently on component ONE
    </h1>
    <a
      name="how-to-win"
      out:send={{ key: 'component-one' }}
      in:receive={{ key: 'component-one' }}
      class="button"
      id="component-one-button"
      href="learnmore/component-one/">
      <div class="icon users-crown">
        <Fa
          icon={faUsersCrown}
          color="var(--theme-fg)"
          secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%, 1)" />
      </div>
    </a>
    <a
      name="how-to-play"
      out:send={{ key: 'component-two' }}
      in:receive={{ key: 'component-two' }}
      class="button"
      id="component-two-button"
      href="learnmore/component-two/">
      <div class="icon swords">
        <Fa
          icon={faSwords}
          color="var(--theme-fg)"
          secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%, 1)" />
      </div>
    </a>
    <a
      name="features"
      out:send={{ key: 'component-three' }}
      in:receive={{ key: 'component-three' }}
      class="button"
      id="component-three-button"
      href="learnmore/component-three/">
      <div class="icon lightbulb-on">
        <Fa
          icon={faLightbulbOn}
          color="var(--theme-fg)"
          secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%, 1)" />
      </div>
    </a>
    <a
      name="issues"
      out:send={{ key: 'component-four' }}
      in:receive={{ key: 'component-four' }}
      class="button"
      id="component-four-button"
      href="learnmore/component-four/">
      <div class="icon exclamation-triangle">
        <Fa
          icon={faExclamationTriangle}
          color="var(--theme-fg)"
          secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%, 1)" />
      </div>
    </a>
    <a
      name="development"
      out:send={{ key: 'component-five' }}
      in:receive={{ key: 'component-five' }}
      class="button"
      id="component-five-button"
      href="learnmore/component-five/">
      <div class="icon construction">
        <Fa
          icon={faConstruction}
          color="var(--theme-fg)"
          secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%, 1)" />
      </div>
    </a>
  </div>
</div>
