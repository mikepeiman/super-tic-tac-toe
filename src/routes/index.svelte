<script>
  import LandingPage from "./../components/LandingPage.svelte";
  // import { fade } from 'svelte/transitions'
  // const emojis = require("emojis-list");
  // console.log(emojis);
</script>

<style lang="scss">
  .homepage-wrapper {
    background: #1a1a1a;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-x: hidden;
    & #play-now {
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.45s;
    z-index: 10;
    }
    & #learn-more {
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.45s;
    z-index: 10;
    }
    & figure {
      opacity: 1;
    }
  }
</style>

<svelte:head>
  <title>TicTacToe - Supercharged Tic Tac Toe!</title>
</svelte:head>
<div class="homepage-wrapper">
  <LandingPage>
    <div slot="app-title">SUPER Tic Tac Toe!</div>
    <div slot="play-now">PLAY NOW!</div>

  </LandingPage>
</div>
