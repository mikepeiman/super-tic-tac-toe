<script>
  import LandingPage from "./../components/LandingPage.svelte";
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
