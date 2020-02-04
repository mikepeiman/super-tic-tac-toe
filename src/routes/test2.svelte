<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { send, receive } from "./../crossfade.js";
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
    console.log(`test2 onMount`);
    log1(`test2 onMount`);
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
    You are on page TWO
  </h1>
  <a
    out:send={{ key: 'test1' }}
    in:receive={{ key: 'test1' }}
    class="button button1"
    id="test1-button"
    href="test1/">
    Test 1 &#x1F525;
  </a>
  <a
    out:send={{ key: 'test1' }}
    in:receive={{ key: 'test1' }}
    class="button home"
    id="button-home"
    href="/">
    &#x1F3E0;
  </a>
</div>
