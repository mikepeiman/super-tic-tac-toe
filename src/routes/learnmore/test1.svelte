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
    console.log(`test1 onMount`);
    log1(`test1 onMount`);
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
  .test-wrapper {
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

  <div class="test-wrapper">
    <h1
      out:send={{ key: 'h1' }}
      in:receive={{ key: 'h1' }}
      class="button heading">
      You are on page ONE
    </h1>
    <a
      out:send={{ key: 'test1' }}
      in:receive={{ key: 'test1' }}
      class="button button2"
      id="test2-button"
      href="learnmore/test2/">
      Test 2 &#x1F4A7;
    </a>
    <a
      out:send={{ key: 'test1' }}
      in:receive={{ key: 'test1' }}
      class="button home"
      id="button-home"
      href="/">
      &#x2302;
    </a>
  </div>
</div>
