<script>
  import { onMount } from "svelte";
  import { send, receive } from "./../crossfade.js";
  import { fade } from "svelte/transition";
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

<style lang="scss">
  $input-blue: rgba(50, 200, 255, 1);

  :global(.homepage-wrapper) {
    height: 100vh;
    & h1#page-title {
      z-index: 10;
      color: white;
      background: none;
      margin: 7.5vh 0 2vh 0;
      top: 0;
      border-bottom: 6px solid $input-blue;
      align-self: flex-start;
      overflow: none;
    }
  }

  .crossfade-wrapper {
    position: absolute;
    min-width: 100vw;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    background: #1a1a1a;
  }
  .crossfade-item {
    position: absolute;
    // transition: all 0.25s;
  }
  .landing-page-wrapper {
    display: flex;
    justify-content: center;
  }

  h1,
  h2,
  h3,
  figure,
  p {
    text-align: center;
    margin: 0 auto;
    color: #efefefef;
  }
  li {
    color: #efefefef;
  }

  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }
  h2 {
    font-size: 2.1em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }


  .button {
    padding: 1rem 2rem;
    background: #1a1a1a;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 12rem;
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
  }


  #play-now,
  #learn-more {
    position: absolute;
    transition: all 0.45s;
  }
  #play-now {
    top: 40%;
  }
  #learn-more {
    top: 60%;
  }


  img {
    max-height: 80vh;
    width: 100%;
    position: relative;
    left: 1rem;
    top: 1rem;
  }

  figure {
    position: absolute;
    display: flex;
    margin: 0;
    top: 0;
    left: 0;
    min-width: 100vw;
    min-height: 100vh;
    // z-index: 1;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.7);
      outline: 2px solid #32c8ff;
      outline-offset: -10px;
      // background-image: radial-gradient(rgba(0,0,0, 0.5), rgba(0,0,0,0));
    }

    & figcaption {
      margin: -2.25rem 0 2rem 0;
      padding: 0;
      z-index: 9;
      color: #555;
      visibility: hidden;
    }
  }

  @media (max-width: 600px) {
    h1 {
      font-size: 3.2em;
    }
    h1 {
      font-size: 2.8em;
    }
    img {
      width: 100vw;
      height: auto;
      position: relative;
      margin: 0;
    }
    figcaption {
      margin: -2.25rem 0 2rem 0;
      padding: 0;
      z-index: 9;
      font-size: 1rem;
      color: #555;
    }
  }

  @media (min-width: 960px) {
    h1 {
      font-size: 4em;
    }
    h2 {
      font-size: 3.2em;
    }
    img {
      width: auto;
      position: relative;
      top: 2rem;
      max-width: 100vw;
      max-height: 95vh;
    }
    .text-content {
      max-width: 60vw;
    }
  }
</style>

<div class="landing-page-wrapper">

  <div class="crossfade-wrapper">
    <h1
      out:send={{ key: 'title' }}
      in:receive={{ key: 'title' }}
      class="crossfade-item page-title"
      id="page-title">
      <slot name="app-title" />
    </h1>
    <a
      out:send={{ key: 'play-now' }}
      in:receive={{ key: 'play-now' }}
      rel="prefetch"
      class="crossfade-item button"
      id="play-now"
      href="tictactoe/">
      <slot name="play-now" />
    </a>

    <a
      out:send={{ key: 'learn-more' }}
      in:receive={{ key: 'learn-more' }}
      rel="prefetch"
      class="crossfade-item button"
      id="learn-more"
      href="learnmore/">
      LEARN MORE
    </a>

    <!--  in:fade="{{duration: 200}}" out:fade="{{delay: 200, duration: 200}}" -->

    <figure id="bg-from-landing-page" out:send={{ key: 'bg-from-landing-page' }} in:receive={{ key: 'bg-from-landing-page' }}>
      <img
        id="tictactoe-game"
        alt="A completed game of Super Tic Tac Toe"
        src="game-dark-2pl.png" />
      <figcaption>An example of a completed game</figcaption>

    </figure>
  </div>

</div>
