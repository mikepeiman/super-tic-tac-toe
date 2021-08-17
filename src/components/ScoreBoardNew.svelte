<script>
  import { onMount, afterUpdate, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import CountPoints from "./CountPoints.svelte";
  import Fa from "sveltejs-fontawesome";
  // import { faMedal } from "js/all.js"
  // import { faSunset } from "js/all.js"
  export let state, players, highlighted;
  import {
    storeSettings,
    storeViewportSize,
    storeState,
    storePlayers,
    storeCurrentPlayer,
    storeDirectionArrays,
    storeGameInProgress,
    storeGameHistoryTurns,
    storePreservePlayerDetails,
    storeGameHistoryFlat
  } from "../stores.js";

  import EmojiSelector from "svelte-emoji-selector";

  $: windowWidth = 0;
  $: windowHeight = 0;
  $: appViewport = {};
  $: placardFactor = 2.5;
  $: placardViewRatio = placardFactor * appViewport.ratio;
  $: placardWidthRatio = appViewport.width / placardFactor / 100;
  $: players = [];
  $: state = {};
  $: currentPlayer = {};
  $: moveNumber = 0;
  $: totalMovesInGame = 0;
  let settings = {};
  $: gameUnderway = false;

  let numberOfPlayers;
  ({ numberOfPlayers } = settings);
  $: {
    if (typeof window !== "undefined") {
      if (players.length > 0) {
        console.log(`reactive addStyles, players.length > 0`);
        numberOfPlayers &&
          addStyles(`updated numberOfPlayers, ${numberOfPlayers}`);
        // window.innerWidth && addStyles("updated window.innerWidth");
        // placardFactor && addStyles("updated placardFactor");
      }

      // console.log(
      //   `\n***window object***    innerWidth ${window.innerWidth}    innerHeight ${window.innerHeight}\n`
      // );
    }
  }

  onMount(() => {
    getViewportSize();
    window.addEventListener(
      "resize",
      function() {
        console.log("resized window calling addStyles!!!");
        addStyles();
      },
      true
    );

    // setPlacardPositions();
    storeSettings.subscribe(value => {
      // console.log(`ScoreBoard => storeSettings.subscribe value => `, value);
      settings = value;
      ({ numberOfPlayers } = settings);
      // addStyles();
    });
    players = $storePlayers;
    state = $storeState;
    storeCurrentPlayer.subscribe(value => {
      // console.log(`ScoreBoard => storeCurrentPlayer subscribed`, value);
      currentPlayer = value;
      if (value === null) {
        currentPlayer = players[0];
      }
    });
    storePlayers.subscribe(value => {
      players = value;
      // console.log(`ScoreBoardNew => storePlayers.subscribe ||| YES assigned! length: ${players.length}`)
    });
    storeViewportSize.subscribe(val => {
      // console.log(`ScoreBoard subscribed to app viewport size: `, val);
      appViewport = val;
    });
    // console.log(
    //   `ScoreBoard subscribed to app viewport size: `,
    //   appViewport.width
    // );
    // console.log(
    //   `ScoreBoard subscribed to app viewport size: `,
    //   appViewport.height
    // );
  });

  afterUpdate(() => {
    // console.log(`afterUpdate()`)
    addHighlightIfGameInProgress();
  });

  function onEmoji(event, player) {
    // let emoji = event.detail;
    console.log(`emoji event ${event}`, event, player);
  }
  function updateStoredPlayers(player, emoji) {
    console.log(
      `ScoreBoard => updateStoredPlayers: input on:blur, this player mark ${player.mark}, name: ${player.name} `,
      player,
      emoji
    );
    if (emoji) {
      player.mark = emoji.detail;
    }
    storePlayers.set(players);
    localStorage.setItem("state", JSON.stringify(state));
    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("playerDetails", true);
    storeCurrentPlayer.set(players[currentPlayer.id]);
    dispatch("playerNameOrMarkerUpdate", players);
    storePreservePlayerDetails.set(true);
  }

  async function setPlacardPositions() {
    await players;
    let placards = await document.querySelectorAll(".scoreboard-player");

    placards.forEach((placard, i) => {
      let height = placard.offsetHeight;
      let width = placard.offsetWidth;
      let left = placard.offsetLeft;
      let widthRatio = appViewport.width / width;
      let heightRatio = appViewport.height / height;
      console.log(
        `=======================   setPlacardPositions()   ========================`,
        placard
      );
      console.log(
        `width ${width} height ${height} widthRatio ${widthRatio} heightRatio ${heightRatio}`
      );
      console.log(
        `=======================   setPlacardPositions()   ========================`
      );
    });
  }

  function highlight(e) {
    console.log(`highlight target `, e.target);
    e.target.select();
    document.execCommand("selectall", null, false);
  }

  async function addStyles(message) {
    console.log(`addStyles message => ${message}`);
    await players;
    console.log(
      `addStyles message => ${message} awaited players, now continuing`
    );
    // await document.getElementById("gameboard");
    let placards = document.querySelectorAll(".scoreboard-player");
    let placard = placards[0];
    let height = placard.offsetHeight;
    let width = placard.offsetWidth;
    width = 237;
    height = 100;
    let left = placard.offsetLeft;
    // console.log(`placard width ${width} height ${height} left ${left}`);
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    let widthRatio = windowWidth / width;
    let heightRatio = appViewport.height / height;
    let placardWidthRatio = (width / height) * placardFactor;
    // let scaleValue = windowWidth / width / 5;
    let scaleValue = windowWidth / width / placardWidthRatio;
    let scaleWidth = `--scale-width: ${scaleValue}`;

    document.documentElement.style.setProperty(
      "--placard-scale-value",
      scaleValue
    );
    // console.log(`scaleValue2: ${scaleValue2}`);
    if (window.innerWidth > 1080) {
      placards.forEach((placard, i) => {
        let pColor = `--player-color: ${players[i].colorMain};`;
        let positionTop = `--position-top: ${i * (height * scaleValue) +
          i * 16}px;`;

        placard.style = `${pColor}; ${scaleWidth}; ${positionTop};`;
      });
    } else {
      placards.forEach((placard, i) => {
        let pColor = `--player-color: ${players[i].colorMain};`;

        placard.style = pColor;
      });
    }

    // for (let i = 0; i < 3; i++) {
    //   let positionTop = `--position-top: ${i * (height * scaleValue) +
    //     i * 16}px;`;
    //   // console.log(
    //   //   `setStyles()!!! --- ||| --- ::: iter ${i}
    //   //   scaleValue ${scaleValue}
    //   //   scaleValue2 ${scaleValue2}
    //   //   windowWidth ${windowWidth}
    //   //   placardWidthRatio
    //   //   ${placardWidthRatio}
    //   //   height * i ${i * height}
    //   //     the final top pos: ${positionTop}`
    //   // );
    // }
  }

  function addHighlightIfGameInProgress() {
    totalMovesInGame = settings.rows * settings.columns;
    moveNumber = JSON.parse(localStorage.getItem("moveNumber"));
    if (moveNumber >= totalMovesInGame || moveNumber < 1) {
      gameUnderway = false;
      return false;
    } else {
      gameUnderway = true;
      return true;
    }
  }
  function getViewportSize() {
    let app = document.querySelector("#sapper");
    console.log(`getViewportSize for app: `, app);
    let appWidth = app.offsetWidth;
    let appHeight = app.offsetHeight;
    let appRatio = parseFloat((appWidth / appHeight).toFixed(2));
    appViewport = {
      width: appWidth,
      height: appHeight,
      ratio: appRatio
    };
    let windowViewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      ratio: parseFloat((window.innerWidth / window.innerHeight).toFixed(2));
    };
    // storeViewportSize.set(appViewport);
    storeViewportSize.set(windowViewport);
    placardFactor = 2.6;
    if (appWidth < 1500) {
      placardFactor = 2.4;
    }
    if (appWidth < 1200) {
      placardFactor = 2.2;
    }
    if (appWidth < 900) {
      placardFactor = 1.9;
    }
    if (appWidth < 600) {
      placardFactor = 1.65;
    }
    // if (appWidth > 1100) {
    //   placardFactor = 2;
    // }
    // if (appWidth > 1500) {
    //   placardFactor = 2.25;
    // }
  }
</script>

<style lang="scss">
  :root {
  }
  .scoreboard-container-inner {
    width: max-content;
    max-width: 100%;
    position: relative;
    z-index: -2;
  }
  .scores-wrap {
    display: flex;
    flex-direction: column;
    background: #1a1a1a;
  }
  .scores-block {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
  .scores-section {
    display: flex;
    flex-direction: column;
  }

  .scoreboard-totals {
    display: flex;
    justify-content: space-between;
    border-radius: 0 0 5px 5px;
    background: rgba(0, 0, 0, 0.5);
    // background: hsla(var(--player-color-hue), 50%, 50%, 0.5);
  }

  .scoreboard-player {
    background: var(--player-color);
    position: absolute;
    border-radius: 5px;
    left: 0;
    top: var(--position-top);
    margin: 0 1rem 1rem 1rem;
    transition: all 0.45s;
    // outline: 5px solid var(--theme-bg)
    min-width: max-content;
    transform-origin: top left;
    transform: scale(var(--scale-width));
    // margin-bottom: var(--custom-marginBottom);
    transition: all 0.45s;
    z-index: -1;
    & .player-name {
      transition: all 0.45s;
      &.dark {
        background: var(--theme-bg);
        color: var(--theme-fg);
        transition: all 0.45s;
      }
      &.light {
        background: var(--theme-bg);
        color: var(--theme-fg);
        transition: all 0.45s;
      }
    }
    & input.player-mark {
      transition: all 0.45s;
      width: 3.5ch;
      &.dark {
        background: var(--theme-bg);
        color: var(--theme-fg);
        transition: all 0.45s;
      }
      &.light {
        background: var(--theme-bg);
        color: var(--theme-fg);
        transition: all 0.45s;
      }
    }
    & .total-score-number {
      transition: all 0.45s;
      &.dark {
        background: var(--theme-bg);
        color: var(--theme-fg);
        transition: all 0.45s;
      }
      &.light {
        background: var(--theme-bg);
        color: var(--theme-fg);
        transition: all 0.45s;
      }
    }
  }

  @media screen and (max-width: 1080px) and (orientation: portrait) {
    .statusbar-slim-wrapper {
      max-width: 100%;
      position: static;
      & #player-name {
        margin: 0 0.5rem 0 0;
        // min-width: auto;
      }
    }
    .scoreboard-container {
      align-items: none;
      justify-content: none;
    }
    .scoreboard-container-inner {
      display: flex;

      // max-width: calc(100vw - 1rem);
      min-width: 100%;
    }
    .gameboard-container {
      justify-content: center;
      align-items: center;
      & #player-name {
        display: none;
      }
    }
    .scoreboard-player {
      display: flex;
      flex-direction: column;
      background: var(--player-color);
      position: relative;
      border-radius: 5px;
      margin: 0;
      transition: all 0.45s;
      min-width: max-content;
      transition: all 0.45s;
      z-index: -1;
      & .total-score {
        // flex-direction: column;
      }
      & .scoreboard-totals {
        // flex-direction: column;
      }
      & .player-name {
        transition: all 0.45s;
        display: none;
        margin: 0;
        &.dark {
          background: var(--theme-bg);
          color: var(--theme-fg);
          transition: all 0.45s;
        }
        &.light {
          background: var(--theme-bg);
          color: var(--theme-fg);
          transition: all 0.45s;
        }
      }
      & .player-mark {
        transition: all 0.45s;
        width: 3.5ch;
        &.dark {
          background: var(--theme-bg);
          color: var(--theme-fg);
          transition: all 0.45s;
        }
        &.light {
          background: var(--theme-bg);
          color: var(--theme-fg);
          transition: all 0.45s;
        }
      }
      & .total-score-number {
        transition: all 0.45s;
        &.dark {
          background: var(--theme-bg);
          color: var(--theme-fg);
          transition: all 0.45s;
        }
        &.light {
          background: var(--theme-bg);
          color: var(--theme-fg);
          transition: all 0.45s;
        }
      }
    }
  }

  #sapper .svelte-emoji-picker__trigger {
    min-height: 2rem;
    margin-right: 0.25rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  #sapper .svelte-emoji-picker {
    background: var(--theme-bg);
    color: var(--theme-fg);
    z-index: 999;
    box-shadow: 0 0 5px 5px var(--theme-fg);
    border: 5px solid var(--player-color);
    & .svelte-emoji-picker__search {
      background: var(--theme-bg);
      color: var(--theme-fg);
      height: 1.5rem;
      border-radius: 5px 5px 0 0;

      & input::-webkit-input-placeholder {
        /* Chrome/Opera/Safari */
        color: var(--theme-fg);
      }
      & input::-moz-placeholder {
        /* Firefox 19+ */
        color: var(--theme-fg);
      }
      & input:-ms-input-placeholder {
        /* IE 10+ */
        color: var(--theme-fg);
      }
      & input:-moz-placeholder {
        /* Firefox 18- */
        color: var(--theme-fg);
      }
    }
    & .svelte-emoji-picker__emoji-tabs {
      background: var(--theme-bg);
      color: var(--theme-fg);
    }
    & .svelte-emoji-picker__emoji-detail {
      background: var(--theme-bg);
      color: var(--player-color);
      padding: 0;
      font-size: 0.8em;
      font-weight: bold;
      height: 3em;
      line-height: 4em;
      z-index: -1;
      position: absolute;
      width: 22rem;
      margin: 0 -0.5rem -1rem -0.5rem;
      text-align: center;
      bottom: 18px;
      right: 9px;
      border: none;
    }
    & .svelte-emoji-picker__emoji-list {
      height: 10rem;
    }
    & .svelte-emoji-picker__emoji-tabs .svelte-tabs ul.svelte-tabs__tab-list {
      overflow: auto;
    }
    & .svelte-tabs__tab-panel h3 {
      color: var(--theme-fg);
    }
    & .fa-svelte {
      color: var(--theme-fg);
    }
  }

  .highlighted {
    // outline: 5px solid var(--theme-fg);
    box-shadow: 0 0 9px 2px hsla(var(--player-color-hue), 70%, 70%, 0.55);
    position: relative;
    transition: all 0.45s;
    min-width: max-content;
    // transform: scale(1.025);
    transform: scale(calc(var(--scale-width) * 1.05));
  }
  .scoreboard-direction {
    // background: rgba(0, 0, 155, 0.5);
    display: flex;
    color: rgba(255, 255, 255, 0.5);
    font-weight: 100;
  }
  .direction-icon {
    margin: 0.5rem;
    filter: brightness(1) invert(1) opacity(0.5);
  }
  .direction-score-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  .direction-score {
    justify-self: flex-end;
    margin-right: 0.5rem;
  }

  .total-score {
    // background: var(--player-color);
    padding: 0.25rem;
    margin: 0.25rem;
    display: flex;
    justify-content: space-between;
    & input {
      margin: 0 0.25rem;
    }

    & .total-score-number {
      background: var(--theme-bg);
      // padding: 0.5rem;
      // margin: 0.25rem;
      border-radius: 2px;
      max-width: 5ch;
      min-width: 3ch;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--player-color);
      text-align: right;
    }
    & .player-name {
      background: var(--theme-bg);
      padding: 0.5rem;
      // margin: 0.25rem;
      border-radius: 2px;
      max-width: 10ch;
      min-width: 10ch;
      color: var(--player-color);
    }
    & .player-mark {
      background: var(--theme-bg);
      // padding: 0.5rem;
      // margin: 0.25rem;
      border-radius: 2px;
      min-width: 3.5ch;
      max-width: 3.5ch;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: var(--player-color);
    }
  }

  @media screen and (min-width: 600px) {
  }
  @media screen and (min-width: 900px) {
  }

  @media screen and (min-width: 1200px) {
  }

  @media screen and (min-width: 1500px) {
  }
</style>

{#if players}
  {#await players then players}
    <div class="scoreboard-container-inner">
      {#each players as player}
        <div
          class="scoreboard-player"
          style={`--viewport-width: ${appViewport.width}`}
          class:highlighted={currentPlayer.id == player.id ? gameUnderway : false}>
          <h3 class="total-score">
            <input
              class="player-name"
              type="text"
              bind:value={player.name}
              placeholder={`${player.name} ${player.mark}`}
              on:click={highlight}
              on:blur={() => updateStoredPlayers(player)} />

            <div class="player-mark">{player.mark}</div>

            <div class="total-score-number">{player.totalScore}</div>
          </h3>
          <div class="scoreboard-totals">
            <div class="scoreboard-points">
              {#each player.scores as direction, i}
                <div class="scoreboard-direction">
                  <div class="direction-score-section">
                    <img
                      class="direction-icon"
                      src={direction.iconSrc}
                      width="20"
                      height="20"
                      alt="Icon for direction {direction.name}" />
                    <div class="direction-score">
                      {player.dirPointsByIndex[i]}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
            <div class="scoreboard-bonuses">
              {#each player.scores as direction, i}
                <div class="scoreboard-direction">
                  <div class="direction-score-section">
                    <img
                      class="direction-icon"
                      src={direction.iconSrc}
                      width="20"
                      height="20"
                      alt="Icon for direction {direction.name}" />
                    <div class="direction-score">
                      {player.dirBonusesByIndex[i]}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/await}
{:else}
  <h1>ScoreBoard awaiting loading players....</h1>
{/if}
