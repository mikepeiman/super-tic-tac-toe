<script>
  import { onMount } from "svelte";
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
    console.log(`LandingPage onMount`);
    log1(`LandingPage onMount`);
  });
</script>

<style lang="scss">
  $input-blue: rgba(50, 200, 255, 1);

  :global(#sapper) {
    overflow-x: hidden;
  }
  :global(.homepage-wrapper) {
    height: 100vh;
    & h1.page-title {
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

  hr {
    border: 0;
    border-bottom: 3px solid rgba(50, 200, 255, 1);
    background: rgba(0, 0, 0, 0.5);
    margin: 2rem;
  }

  .button {
    padding: 1rem 2rem;
    background: #1a1a1a;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
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
    // &#learn-more {
    //   color: rgba(75, 155, 75, 1);
    //   border: 3px solid rgba(75, 155, 75, 1);
    //   box-shadow: 0 0 5px 10px rgba(75, 155, 75, 0.25);
    //   transition: all 0.45s;
    //   &:hover {
    //     color: rgba(75, 155, 75, 1);
    //     border: 3px solid white;
    //     box-shadow: 0 0 10px 20px rgba(75, 155, 75, 0.5);
    //     transition: all 0.45s;
    //   }
    // }
  }

  #final-button {
    box-shadow: 0 0 3px 4px rgba(50, 200, 255, 0.25);
    margin: 1rem 0 5rem 0;
    &:hover {
      box-shadow: 0 0 4px 5px rgba(50, 200, 255, 0.5);
      transition: all 0.45s;
    }
  }

  #play-now,
  #learn-more {
    position: absolute;
    transition: all 0.45s;
    z-index: 10;
  }
  #play-now {
    top: 40%;
  }
  #learn-more {
    top: 60%;
  }
  #page-title {
    top: 0;
    opacity: 1;
    z-index: 11;
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

  p {
    margin: 1em auto;
  }

  .two-columns {
    display: grid;
    grid-template-columns: 40vw 40vw;
  }
  .text-content {
    max-width: 80vw;
    color: #abc;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    // border-radius: 10px;
    // background: black;
  }

  .game-info {
    margin: 2rem 0 0 0;
    position: relative;
    top: 70vh;
  }

  span {
    background: rgba(119, 94, 94, 0.25);
    font-weight: 300;
    padding: 0 1ch;
    &.nice {
      color: rgba(140, 255, 140, 0.75);
    }
    &.note {
      color: rgba(255, 140, 140, 0.75);
    }
    &.cool {
      color: rgba(140, 140, 255, 0.75);
    }
    &.bold {
      font-weight: 700;
    }
    &.underline {
      border-bottom: 1px solidrgba(0, 0, 0, 0.75);
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
    
  <figure>
    <img
      id="tictactoe-game"
      alt="A completed game of Super Tic Tac Toe"
      src="game-dark-2pl.png" />
    <figcaption>An example of a completed game</figcaption>

  </figure>
  </div>

</div>
