<script>
  import { onMount, afterUpdate, createEventDispatcher } from "svelte";
  import Loading from "./../components/Loading.svelte";
  import { send, receive } from "./../crossfade.js";
  const dispatch = createEventDispatcher();
  import CountPoints from "./CountPoints.svelte";

  // Following are the imports for modals, Font Awesome icons and FA component
  import Modal from "svelte-simple-modal";
  // import Fa from "sveltejs-fontawesome";
  // import { faEdit } from "js/all.js"
  // import { faPlus } from "/static/js/all.js"
  // import { fa-plus } as faPlus from "/static/js/all.js"
  // import { faPlus } from "/static/css/all.css"
  // import { faMinus } from "js/all.js"
  export let state, players, highlighted;
  import { storeButtonStyles } from "../stores.js";
  let { _color, _secondaryColor, _secondaryOpacity } = $storeButtonStyles;
  // end FA/modal imports
  import {
    storeSettings,
    storeViewportSize,
    storeState,
    storePlayers,
    storePlayersScored,
    storeCurrentPlayer,
    storeDirectionArrays,
    storeGameInProgress,
    storeGameHistoryTurns,
    storePreservePlayerDetails,
    storeGameHistoryFlat
  } from "../stores.js";
  import EmojiSelector from "svelte-emoji-selector";
  let updateCount = 0;
  let windowWidth = 0;
  let windowHeight = 0;
  let appViewport = {};
  let placardFactor = 2.5;
  $: placardViewRatio = placardFactor * appViewport.ratio;
  $: placardWidthRatio = appViewport.width / placardFactor / 100;
  players = [];
  state = {};
  let currentPlayer = {};
  let moveNumber = 0;
  let totalMovesInGame = 0;
  let settings = {};
  let gameUnderway = false;
  let numberOfPlayers;
  ({ numberOfPlayers } = settings);
  storeSettings.subscribe(value => {
    console.log(`ScoreBoard => storeSettings.subscribe value => `, value);
    settings = value;
    ({ numberOfPlayers } = settings);
    // addStyles();
  });
  storeCurrentPlayer.subscribe(value => {
    // console.log(`ScoreBoard => storeCurrentPlayer subscribed`, value);

    currentPlayer = value;
    if (value === null) {
      currentPlayer = players[0];
    }
  });

  storePlayersScored.subscribe(val => {
    // console.log(
    //   `playersScored() receiving an update, running odometerScores() `
    // );
    odometerScores();
    storePlayersScored.set(false);
  });
  storePlayers.subscribe(value => {
    players = value;
    // console.log(
    //   `ScoreBoard => storePlayers.subscribe ||| YES assigned! length: ${players.length}`
    // );
    if (typeof window !== "undefined") {
    }
  });
  storeViewportSize.subscribe(val => {
    // console.log(`ScoreBoard subscribed to app viewport size: `, val);
    appViewport = val;
  });

  onMount(() => {
    getViewportSize();
    window.addEventListener(
      "resize",
      function() {
        console.log("resize!");
        addStyles();
      },
      true
    );
    players = $storePlayers;
    state = $storeState;
    odometerScores();
  });

  afterUpdate(() => {
    updateCount++;
    // console.log(`afterUpdate() count: ${updateCount}`);
    addStyles(`addStyles() from afterUpdate`);
    addHighlightIfGameInProgress();
    // odometerScores();
  });

  function odometerScores() {
    if (players.length) {
      for (let i = 0; i < players.length; i++) {
        let totalScoreEl = document.getElementById(`total-score-${i}`);
        // console.log(
        //   `totalScoreEl for odometer: ${typeof totalScoreEl} ${Boolean(
        //     totalScoreEl
        //   )}`,
        //   totalScoreEl
        // );
        if (totalScoreEl) {
          let od = new Odometer({
            el: totalScoreEl,
            value: players[i].totalScore,
            duration: 10 * 1000
          });
          if (typeof od !== "undefined") {
            // console.log(
            //   `storeMovesRemaining.subscribe => supposed to be rolling odometer now with .update()....`
            // );
            od.update(players[i].totalScore);
          }
        }

        for (let d = 0; d < 4; d++) {
          let dirScoreEl = document.getElementById(`direction-score-${i}-${d}`);
          // console.log(
          //   `dirScoreEl for odometer: ${typeof dirScoreEl} ${Boolean(
          //     dirScoreEl
          //   )}`,
          //   dirScoreEl
          // );
          if (dirScoreEl) {
            let od = new Odometer({
              el: dirScoreEl,
              value: players[i].dirScoresByIndex[d],
              duration: 10 * 1000
            });
            if (typeof od !== "undefined") {
              // console.log(
              //   `players[${i}].dirScoresByIndex[${d}] for odometer: ${players[i].dirScoresByIndex[d]}`
              // );
              od.update(players[i].dirScoresByIndex[d]);
            }
          }
        }

        // player.dirScoresByIndex[i]
      }
    }
  }

  function onEmoji(event, player) {
    // let emoji = event.detail;
    console.log(`emoji event ${event}`, event, player);
  }

  async function editPlayerDetails(e, player) {
    let cname = "player-details-icon";
    console.log(`editPlayerDetails()   clicked ${player.name}, e `, e);
    let editPlayerIcon = await findParentElementWithClassName(e.target, cname);
    if (!editPlayerIcon.classList.contains(cname)) {
      editPlayerIcon = editPlayerIcon.parentElement;
    }
    console.log(`returned editPlayerIcon: `, editPlayerIcon);
    cname = "player-name";
    let playerNameInputElement = await findSiblingElementWithClassName(
      editPlayerIcon,
      cname
    );
    console.log(`returned playerNameInputElement: `, playerNameInputElement);
    if (!playerNameInputElement.classList.contains(cname)) {
      playerNameInputElement =
        playerNameInputElement.previousElementSibling.previousElementSibling
          .previousElementSibling;
      console.log(
        `#2 !if returned playerNameInputElement: `,
        playerNameInputElement
      );
    }
    playerNameInputElement.select();
  }

  function findParentElementWithClassName(e, cname) {
    console.log(
      `findParentElementWithClassName() => opening, cname ${cname} `,
      e
    );
    if (e.classList.contains(cname)) {
      console.log(`findParentElementWithClassName() => SUCCESS, found `, e);
    } else {
      e = e.parentElement;
      findParentElementWithClassName(e, cname);
    }
    return e;
  }

  function findSiblingElementWithClassName(e, cname) {
    console.log(
      `findSiblingElementWithClassName() => opening, cname ${cname} `,
      e
    );
    let el = e;
    if (!el.classList.contains(cname)) {
      el = el.previousElementSibling;
      findSiblingElementWithClassName(el, cname);
    } else {
      console.log(`findSiblingElementWithClassName() => SUCCESS, found `, el);
    }
    return el;
  }
  function toggleDeactivatePlacardsSoEmojiCanPick(e) {
    // console.log(`toggleDeactivatePlacardsSoEmojiCanPick() event: `, e);
    let p1, p2, p3, thisPlacard;
    p1 = e.target.parentElement.parentElement;
    p2 = e.target.parentElement.parentElement.parentElement;
    p3 = e.target.parentElement.parentElement.parentElement.parentElement;
    if (p1.classList.contains("scoreboard-player")) {
      console.log(`p1 is placard`);
      thisPlacard = p1;
    }
    if (p2.classList.contains("scoreboard-player")) {
      console.log(`p2 is placard`);
      thisPlacard = p2;
    }
    if (p3.classList.contains("scoreboard-player")) {
      console.log(`p3 is placard`);
      thisPlacard = p3;
    }
    let placards = document.querySelectorAll(".scoreboard-player");
    placards.forEach(placard => {
      if (thisPlacard !== placard) {
        placard.classList.toggle("deactivated");
      }
    });
  }

  async function removeDeactivatePlacardsSoEmojiCanPick() {
    let placards = document.querySelectorAll(".scoreboard-player");
    placards.forEach(placard => {
      console.log(
        `removeDeactivatePlacardsSoEmojiCanPick() removing... `,
        placard.classList
      );
      placard.classList.remove("deactivated");
      console.log(
        `removeDeactivatePlacardsSoEmojiCanPick() removing... `,
        placard.classList
      );
    });
  }

  function updateStoredPlayers(player, emoji, e) {
    console.log(
      `ScoreBoard => updateStoredPlayers: input on:blur, this player mark ${player.mark}, name: ${player.name} `,
      player,
      emoji,
      e
    );
    if (emoji) {
      // removeDeactivatePlacardsSoEmojiCanPick();
      player.mark = emoji.detail;
    }
    let placards = document.querySelectorAll(".scoreboard-player");
    placards.forEach(placard => {
      console.log(
        `removeDeactivatePlacardsSoEmojiCanPick() removing... `,
        placard.classList
      );
      placard.classList.remove("deactivated");
      console.log(
        `removeDeactivatePlacardsSoEmojiCanPick() removing... `,
        placard.classList
      );
    });
    players = players;
    storePlayers.set(players);
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
      // console.log(
      //   `=======================   setPlacardPositions()   ========================`,
      //   placard
      // );
      // console.log(
      //   `width ${width} height ${height} widthRatio ${widthRatio} heightRatio ${heightRatio}`
      // );
      // console.log(
      //   `=======================   setPlacardPositions()   ========================`
      // );
    });
  }
  function highlight(e) {
    console.log(`highlight target `, e.target);
    e.target.select();
    document.execCommand("selectall", null, false);
  }
  async function addStyles(message) {
    // console.log(`addStyles message => ${message}`);
    await players;
    // console.log(
    //   `addStyles message => ${message} awaited players, now continuing`
    // );
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
    placards.forEach((placard, i) => {
      setEmojiSelectorToPlayerMark(placard, players[i]);
      // console.dir(placard);
      let pColor = `--player-color: ${players[i].colorMain};`;
      let positionTop = `--position-top: ${i * (height * scaleValue) +
        i * 16}px;`;
      placard.style = `${pColor}; ${scaleWidth}; ${positionTop};`;
    });
    for (let i = 0; i < 3; i++) {
      let positionTop = `--position-top: ${i * (height * scaleValue) +
        i * 16}px;`;
      // console.log(
      //   `setStyles()!!! --- ||| --- ::: iter ${i}
      //   scaleValue ${scaleValue}
      //   scaleValue2 ${scaleValue2}
      //   windowWidth ${windowWidth}
      //   placardWidthRatio
      //   ${placardWidthRatio}
      //   height * i ${i * height}
      //     the final top pos: ${positionTop}`
      // );
    }
  }

  function setEmojiSelectorToPlayerMark(placard, player) {
    let emojiTrigger = placard.children[0].children[2];
    // console.log(
    //   `setEmojiSelectorToPlayerMark(placard, player) emojiTrigger `,
    //   emojiTrigger
    // );
    emojiTrigger.setAttribute("data-player-mark", player.mark);
    // console.log(
    //   `setEmojiSelectorToPlayerMark(placard, player) emojiTrigger `,
    //   emojiTrigger
    // );
  }

  function addHighlightIfGameInProgress() {
    // console.log(`addHighlightIfGameInProgress()`);
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
    // console.log(`getViewportSize for app: `, app);
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
      ratio: parseFloat((window.innerWidth / window.innerHeight).toFixed(2))
    };
    // storeViewportSize.set(appViewport);
    storeViewportSize.set(windowViewport);
    // storeViewportSize.set(appViewport);
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
  }
  function resetGame() {
    console.log(`reset game`);
    localStorage.removeItem("gameboard");
    localStorage.removeItem("gameHistoryFlat");
    localStorage.removeItem("gameHistoryTurns");
    localStorage.removeItem("turnHistory");
    localStorage.removeItem("lines");
    localStorage.removeItem("moveNumber");

    localStorage.setItem(
      "state",
      JSON.stringify({
        lastTicked: "",
        currentPlayer: players[0],
        movesRemaining: settings.movesPerTurn,
        turn: 0,
        gameHistory: [],
        turnHistory: [],
        clickCount: 0,
        moveNumber: 0,
        reset: false
      })
    );
    // localStorage.removeItem("gameInProgress");

    players.forEach(player => {
      player.lines = [];
      player.totalScore = 0;
      player.dirScoresByIndex = [0, 0, 0, 0];
    });
    // localStorage.setItem("players", JSON.stringify(players));
    storePlayers.set(players);
    // storeCurrentPlayer.set(players[0]);
    // location.reload();
    dispatch("resetGame", true);
  }

  function addPlayer() {
    console.log(
      `addPlayer() clicked increasing #players from ${settings.numberOfPlayers}, ${settings["numberOfPlayers"]}`
    );
    let gameInProgress = localStorage.getItem("gameInProgress");
    if (!gameInProgress) {
      if (settings.numberOfPlayers < 8) {
        console.log(`addPlayer() clicked below 8`);
        let num = settings.numberOfPlayers + 1;
        settings.numberOfPlayers = num;
        // console.log(settings);
        storeSettings.set(settings);
        resetGame();
      }
    } else {
      alert(
        "There appears to be a game in progress, reset game ('MENU' button => 'Reset Game' button) in order to change number of players"
      );
    }
  }
  function removePlayer() {
    console.log(
      `removePlayer() clicked reducing #players from ${settings.numberOfPlayers}, ${settings["numberOfPlayers"]}`
    );
    let gameInProgress = localStorage.getItem("gameInProgress");
    if (!gameInProgress) {
      if (settings.numberOfPlayers > 1) {
        console.log(`addPlayer() clicked above 1`);
        let num = settings.numberOfPlayers - 1;
        settings.numberOfPlayers = num;
        // console.log(settings);
        storeSettings.set(settings);
        resetGame();
      }
    } else {
      alert(
        "There appears to be a game in progress, reset game ('MENU' button => 'Reset Game' button) in order to change number of players"
      );
    }
  }
</script>

<style lang="scss">
  .scoreboard-container-inner {
    width: max-content;
    max-width: 100%;
    position: relative;
    z-index: -2;
    // overflow-x: auto;
    & .add-or-remove-players {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 5.75rem;
      margin-left: 0.5rem;
    }
    & .add-or-remove-player-button {
      width: 1.75rem;
      height: 1.75rem;
      margin: 0.5rem;
      font-size: 1rem;
      background: var(--player-color-dark);
      color: var(--theme-light);
      // border: 2px solid var(--player-color-dark);
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
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
    border-radius: 0; // 0 5px 5px;
    background: rgba(0, 0, 0, 0.5);
    // background: hsla(var(--player-color-hue), 50%, 50%, 0.5);
  }
  :global(.scoreboard-player.deactivated) {
    pointer-events: none;
  }
  .scoreboard-player {
    background: var(--player-color);
    // position: absolute;
    border-radius: 0;
    left: 0;
    // top: var(--position-top);
    margin: 0 1rem 1rem 1rem;
    transition: all 0.45s;
    // outline: 5px solid var(--theme-bg)
    min-width: max-content;
    transform-origin: top left;
    // transform: scale(var(--scale-width));
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
      display: none;
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
  :global(button.svelte-emoji-picker__trigger) {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
    width: 4ch;
    font-size: 1.25rem;
    left: 0;
    top: 0px;
    font-size: 1rem;
    &:hover {
      outline: 2px solid var(--player-color-light);
      outline-offset: -2px;
    }
    &:active {
      outline: 2px solid var(--player-color-light);
      outline-offset: -2px;
    }
    & svg {
      visibility: hidden;
    }
    &:before {
      content: attr(data-player-mark);
      position: absolute;
      font-size: 1.25rem;
      left: 0px;
      top: 20%;
      width: 100%;
      width: -moz-available; /* WebKit-based browsers will ignore this. */
      width: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
      width: fill-available;
      height: 100%;
      height: -moz-available; /* WebKit-based browsers will ignore this. */
      height: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
      height: fill-available;
    }
  }
  :global(#sapper .svelte-emoji-picker) {
    background: var(--theme-bg);
    color: var(--theme-fg);
    z-index: 999;
    box-shadow: 0 0 5px 5px var(--theme-fg);
    border: 5px solid var(--player-color);
    position: relative;

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
    // transform: scale(calc(var(--scale-width) * 1.05));
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
    font-family: inherit;
    font-weight: 300;
  }
  :global(.total-score) {
    position: relative;
    padding: 0.25rem;
    margin: 0.25rem;
    display: flex;
    justify-content: space-between;
    & input {
      margin: 0 0.25rem;
    }
    & .player-details-icon {
      margin: 0;
      padding: 0;
      height: 1rem;
      width: 1rem;
      background: none;
      position: relative;
      right: -0.3rem;
      top: -0.75rem;
      // margin: 0;
      // padding: 0;
      // min-height: 1.5rem;
      // min-width: 1.5rem;
      // background: var(--player-color);
      // position: relative;
      // border-radius: 0 5px 0 2px;
      // padding: 2px;
    }
  }
  .total-score-number {
    background: var(--theme-bg);
    // padding: 0.5rem;
    // margin: 0.25rem;
    border-radius: 2px;
    max-width: 5ch;
    min-width: 4ch;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--player-color);
    text-align: right;
  }
  .player-name {
    background: var(--theme-bg);
    padding: 0.5rem;
    // margin: 0.25rem;
    border-radius: 2px;
    max-width: 10ch;
    min-width: 10ch;
    color: var(--player-color);
  }
  .player-mark {
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
  // @media screen and (min-width: 960px) {
  //   .scoreboard-player {
  //     background: var(--player-color);
  //     margin: 0 1rem 1rem 1rem;
  //     transition: all .45s;
  //     border: 5px solid #1a1a1a;
  //     // min-width: calc(100% - 10px - 1rem);
  //     transform: scale(1);
  //   }
  //   .highlighted {
  //     transform: scale(1.025);
  //     border: 5px solid #eeeeee;
  //     position: relative;
  //     transition: all .45s;
  //   }
  // }
  @media screen and (min-width: 600px) {
  }
  @media screen and (min-width: 900px) {
    .scoreboard-container-inner {
      width: max-content;
      max-width: 100%;
      position: relative;
      z-index: -2;
      // overflow-x: auto;
      & .add-or-remove-players {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 5.75rem;
        margin-left: 0.5rem;
      }
      & .add-or-remove-player-button {
        width: 2.5rem;
        height: 2.5rem;
        margin: 0 0.5rem;
        font-size: 1.25rem;
        background: var(--player-color);
        color: var(--theme-light);
        // border: 2px solid var(--player-color-dark);
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  @media screen and (min-width: 1200px) {
  }
  @media screen and (min-width: 1500px) {
  }
</style>

<!-- {@debug players} -->
<!-- {@debug grid} -->
<!-- {@debug settings} -->
{#if players}
  {#await players then players}

    <div class="scoreboard-container-inner">
      <div class="add-or-remove-players">
        <div
          class="add-or-remove-player-button"
          id="add-player"
          on:click={addPlayer}>
          <span class="iconify" data-icon="fa:plus"></span>
          <!-- <Fa
            color={`var(--theme-light)`}
            secondaryColor={`var(--theme-light)`}
            secondaryOpacity={_secondaryOpacity} /> -->
        </div>
        <div
          class="add-or-remove-player-button"
          id="remove-player"
          on:click={removePlayer}>
          <span class="iconify" data-icon="fa:minus" color={`var(--theme-light)`}></span>
          <!-- <Fa
            icon={faMinus}
            color={`var(--theme-light)`}
            secondaryColor={`var(--theme-light)`}
            secondaryOpacity={_secondaryOpacity} /> -->
        </div>
      </div>
      {#each players as player, i}
        <div
          class="scoreboard-player"
          style={`--viewport-width: ${appViewport.width}`}
          class:highlighted={currentPlayer.id == player.id ? gameUnderway : false}>
          <h3 class="total-score">
            <input
              class="player-name"
              type="text"
              bind:value={player.name}
              placeholder={player.name}
              on:click={highlight}
              on:blur={() => updateStoredPlayers(player)} />
            <input
              class="player-mark"
              type="text"
              bind:value={player.mark}
              placeholder={player.mark}
              maxlength="1"
              on:click={highlight}
              on:blur={() => updateStoredPlayers(player)} />
            <EmojiSelector
              class="player-mark"
              type="text"
              bind:value={player.mark}
              placeholder={player.mark}
              data-player-mark={player.mark}
              maxlength="1"
              style={`--this-player-color-main: ${player.colorMain}`}
              on:click={e => toggleDeactivatePlacardsSoEmojiCanPick(e)}
              on:emoji={e => updateStoredPlayers(player, e)} />
            <div class="total-score-number odometer" id="total-score-{i}">
              {player.totalScore}
            </div>
            <!-- keep in mind that below uses DOM traversal to highlight player-name input, will break if markup changes -->
            <button
              class="player-details-icon"
              on:click={e => editPlayerDetails(e, player)}>
              <!-- <Fa
                icon={faEdit}
                color={`var(--theme-bg)`}
                secondaryColor={player.colorDark}
                secondaryOpacity={_secondaryOpacity} /> -->
              <!-- <div class="button-text"></div> -->
            </button>
          </h3>
          <div class="scoreboard-totals">
            {#each player.scores as direction, d}
              <div class="scoreboard-direction">
                <div class="direction-score-section">
                  <img
                    class="direction-icon"
                    src={direction.iconSrc}
                    width="20"
                    height="20"
                    alt="Icon for direction {direction.name}" />
                  <div
                    class="direction-score odometer"
                    id="direction-score-{i}-{d}">
                    {player.dirScoresByIndex[d]}
                  </div>
                </div>
              </div>
            {/each}
          </div>
          <!-- <div class="scoreboard-totals">
          {#each player.scores as direction, i}
            <div class="scoreboard-direction">
              <div class="direction-score-section">
                <img
                  class="direction-icon"
                  src={direction.iconSrc}
                  width="20"
                  height="20"
                  alt="Icon for direction {direction.name}" />
                <div class="direction-score">{player.dirBonusesByIndex[i]}</div>
              </div>
            </div>
          {/each}
        </div> -->
        </div>
      {/each}
    </div>
  {/await}
{:else}
  <Loading
    loadingMsg="ScoreBoard loading via COMPONENT..."
    thisId="scoreboard" />
{/if}
