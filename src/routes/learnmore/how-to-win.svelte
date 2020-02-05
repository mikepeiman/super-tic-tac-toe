<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { send, receive } from "./../../crossfade.js";
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

<div class="content-wrapper">
  <div class="text-content">

    <h1
      out:send={{ key: 'h1' }}
      in:receive={{ key: 'h1' }}
      class="button heading">
      How To Win
    </h1>

    <h3>
      <span class="nice">Score the most points! Easy, right?</span>
    </h3>
  </div>
      <a
        name="how-to-play"
        out:send={{ key: 'component-two' }}
        in:receive={{ key: 'component-two' }}
        class="button side-menu"
        id="component-two-button"
        href="learnmore/how-to-play/">
        <div class="icon swords">
          <Fa
            icon={faSwords}
            color="white"
            secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%,
            1)" />
          How To Play
        </div>
      </a>
</div>
