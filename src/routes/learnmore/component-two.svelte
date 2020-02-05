<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { send, receive } from "./../../crossfade.js";
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
    console.log(`component-two onMount`);
    log1(`component-two onMount`);
  });
</script>

<style lang="scss">
  $input-blue: rgba(50, 200, 255, 1);

  .test-wrapper {
    position: absolute;
    display: flex;
    background: #1a1a1a;
    width: 100vw;
    height: 100vh;
  }
  .button {
    position: relative;
    padding: 1rem 2rem;
    background: #1a1a1a;
    border-radius: 5px;
    height: 100px;
    width: 10rem;
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
      top: 0;
    }
    &.home {
      font-size: 2rem;
      font-weight: 900;
    }
  }

  .button1 {
    top: 30vh;
    background: #facc00;
    box-shadow: 0 0 5px 10px rgba(50, 200, 255, 0.25);
    left: 10vw;
  }
</style>

<div class="test-wrapper">
  <h1
    out:send={{ key: 'h1' }}
    in:receive={{ key: 'h1' }}
    class="button heading">
    Currently on component TWO
  </h1>
  <a
    out:send={{ key: 'component-one' }}
    in:receive={{ key: 'component-one' }}
    class="button button1"
    id="component-one-button"
    href="learnmore/component-one/">
   Component One &#x1F525;
   <div class="icon"></div>
  </a>
  <a
    out:send={{ key: 'component-two' }}
    in:receive={{ key: 'component-two' }}
    class="button home"
    id="button-home"
    href="/">
    &#x1F3E0;
  </a>
</div>
