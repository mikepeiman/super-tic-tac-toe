<script>
  import { onMount } from "svelte";
  import Fa from "sveltejs-fontawesome";
  // import { faSunrise } from "js/all.js"
  // import { faSunset } from "js/all.js"
  // import { faSun } from "js/all.js"
  // import { faMoon } from "js/all.js"
  import {
    storeState,
    storeMoveNumber,
    storeMovesRemaining
  } from "../stores.js";
  // import { storeViewportSize } from "./../stores.js";

  const light = "#efefefef";
  const dark = "#1a1a1a";
  let elements,
    viewport,
    movesRemaining,
    movesRemainingEl,
    movesPlayed,
    movesPlayedEl;

  storeMovesRemaining.subscribe(val => {
    movesRemaining = val;
    // console.log(`nightmodetoggle storeMovesRemaining ${movesRemaining}`);
    if (typeof window !== "undefined") {
      movesRemainingEl = document.getElementById("movesRemaining");
      let od = new Odometer({
        el: movesRemainingEl,
        value: movesRemaining,
        duration: 10 * 1000
      });
      if (typeof od !== "undefined") {
        // console.log(
        //   `storeMovesRemaining.subscribe => supposed to be rolling odometer now with .update()....`
        // );
        od.update(movesRemaining);
      }
    }
  });

  storeMoveNumber.subscribe(val => {
    movesPlayed = val;
    // console.log(`nightmodetoggle storeMoveNumber ${movesPlayed}`);
    if (typeof window !== "undefined") {
      movesPlayedEl = document.getElementById("movesPlayed");
      let od = new Odometer({
        el: movesPlayedEl,
        value: movesPlayed,
        duration: 10 * 1000
      });
      if (typeof od !== "undefined") {
        // console.log(
        //   `storeMovesRemaining.subscribe => supposed to be rolling odometer now with .update()....`
        // );
        od.update(movesPlayed);
      }
    }
  });

  onMount(() => {
    document.documentElement.style.setProperty("--theme-bg", dark);
    document.documentElement.style.setProperty("--theme-dark", dark);
    document.documentElement.style.setProperty("--theme-fg", light);
    document.documentElement.style.setProperty("--theme-light", light);
    document.documentElement.style.setProperty(
      "--input-blue",
      "rgba(50, 200, 255, 1)"
    );
    const page = document.querySelector(".page-container");
    const toggleSwitch = document.querySelector("#night-mode-toggle");
    const currentTheme = localStorage.getItem("theme");
    currentTheme ? localStorage.getItem("theme") : null;
    toggleSwitch.checked = true;
    initStylesDark();
    if (currentTheme) {
      // page.classList = `page-container ${currentTheme}`;
      // page.classList.toggle(currentTheme);
      console.log(`currentTheme from ls exists: ${currentTheme}`);
      document.documentElement.style.setProperty("--theme-bg", dark);
      document.documentElement.style.setProperty("--theme-fg", light);
      if (currentTheme === "light") {
        toggleStyles(currentTheme);
        console.log(`currentTheme from ls is dark: ${currentTheme}`);
        toggleSwitch.checked = false;
        document.documentElement.style.setProperty("--theme-bg", light);
        document.documentElement.style.setProperty("--theme-fg", dark);
      }
    }

    movesRemainingEl = document.getElementById("movesRemaining");
    console.log(
      `let movesRemainingEl = document.getElementById('movesRemaining') `,
      movesRemainingEl
    );
    let od = new Odometer({
      el: movesRemainingEl,
      value: movesRemaining
    });
  });

  const toggleTheme = e => {
    const currentTheme = localStorage.getItem("theme");
    const toggleSwitch = document.querySelector("#night-mode-toggle");

    if (e.target.checked) {
      toggleSwitch.checked = true;
      e.target.dispatchEvent(new Event("change"));
      document.documentElement.style.setProperty("--theme-bg", dark);
      document.documentElement.style.setProperty("--theme-fg", light);
      localStorage.setItem("theme", "dark");
    } else {
      e.target.checked = false;
      e.target.dispatchEvent(new Event("change"));
      document.documentElement.style.setProperty("--theme-bg", light);
      document.documentElement.style.setProperty("--theme-fg", dark);
      localStorage.setItem("theme", "light");
    }
    toggleStyles(currentTheme);
  };

  function toggleStyles(theme) {
    const toggleSwitch = document.querySelector("#night-mode-toggle");
    const page = document.querySelector(".page-container");
    const placards = document.querySelectorAll(".scoreboard-player");
    const playerNames = document.querySelectorAll(".player-name");
    const playerMarks = document.querySelectorAll(".player-mark");
    const playerScores = document.querySelectorAll(".total-score-number");
    const settings = document.querySelector(".settings-wrapper");
    const statusbar = document.querySelector(".statusbar-slim-wrapper");
    const icons = document.querySelectorAll(".icon");
    if (settings) {
      elements = [page, statusbar, settings];
    } else {
      elements = [page, statusbar];
    }
    playerNames.forEach(name => {
      elements.push(name);
    });
    playerMarks.forEach(mark => {
      elements.push(mark);
    });
    playerScores.forEach(score => {
      elements.push(score);
    });

    icons.forEach((icon, i) => {
      icon.classList.toggle("hidden");
    });

    elements.forEach(el => {
      el.classList.toggle("dark");
      el.classList.toggle("light");
    });
  }

  function initStylesDark() {
    const page = document.querySelector(".page-container");
    const placards = document.querySelectorAll(".scoreboard-player");
    const playerNames = document.querySelectorAll(".player-name");
    const playerMarks = document.querySelectorAll(".player-mark");
    const playerScores = document.querySelectorAll(".total-score-number");
    const settings = document.querySelector(".settings-wrapper");
    const icons = document.querySelectorAll(".icon");
    if (settings) {
      elements = [page, settings];
    } else {
      elements = [page];
    }

    playerNames.forEach(name => {
      elements.push(name);
    });
    playerMarks.forEach(mark => {
      elements.push(mark);
    });
    playerScores.forEach(score => {
      elements.push(score);
    });
    icons.forEach((icon, i) => {
      // console.log(
      //   `toggleStyles() ====---------------====={   icon ${i} classlist   }===>>>>>>>>>>>>>>>>>>>>>> ${icon.classList}`
      // );
      icon.classList.toggle("hidden");
      // console.log(
      //   `toggleStyles() ====---------------====={   icon ${i} classlist   }===>>>>>>>>>>>>>>>>>>>>>> ${icon.classList}`
      // );
    });
    elements.forEach(el => {
      el.classList.remove("light");
      el.classList.remove("dark");
      el.classList.add("dark");
    });
  }

  let buttonStyles = `color="var(--theme-fg)"
      secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%, 1)"`;
  // make an addStyles to set initial theme class on each element
</script>

<style lang="scss" global>
  /*Simple css to style it like a toggle switch*/

  :global(#theme-switch-wrapper) {
    display: -webkit-box;
    display: block;
    -webkit-box-align: center;
    align-items: center;
    margin-right: 1rem;
    width: 100%;
  }

  .theme-switch {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 2.5rem;
    position: relative;
    // width: 12ch;
  }

  .theme-switch input {
    display: none;
  }

  .toggle-text {
    color: var(--theme-fg);
    position: absolute;
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 400;
    top: -0.25rem;
    right: 0.75rem;
  }

  .slider {
    background-color: var(--theme-fg);
    width: 60px;
    height: 26px;
    bottom: 0;
    cursor: pointer;
    // left: 0;
    position: absolute;
    right: 0;
    top: 0.5rem;
    transition: 0.4s;
  }

  .slider:before {
    background-color: var(--theme-bg);
    bottom: 3px;
    content: "";
    height: 19.5px;
    left: 5px;
    position: absolute;
    transition: 0.4s;
    width: 19.5px;
  }

  input:checked + .slider {
    // transform: translateX(31px);
    background: var(
      --player-color
    ); // hsla(var(--player-color-hue), 50%, 50%, 0.75);
  }

  input:checked + .slider:before {
    transform: translateX(31px);
  }

  .slider.round {
    border-radius: 25.5px;
  }

  .slider.round:before {
    border-radius: 50%;
  }

  .statusbar-slim-wrapper
    .odometer.odometer-auto-theme.odometer-animating-up
    .odometer-ribbon-inner,
  .odometer.odometer-theme-minimal.odometer-animating-up .odometer-ribbon-inner,
  .odometer.odometer-auto-theme.odometer-animating-down.odometer-animating
    .odometer-ribbon-inner,
  .odometer.odometer-theme-minimal.odometer-animating-down.odometer-animating
    .odometer-ribbon-inner {
    -webkit-transition-duration: 0.25s !important;
    -moz-transition-duration: 0.25s !important;
    -ms-transition-duration: 0.25s !important;
    -o-transition-duration: 0.25s !important;
    transition-duration: 0.25s !important;
  }

  .scoreboard-container-inner
    .odometer.odometer-auto-theme.odometer-animating-up
    .odometer-ribbon-inner,
  .odometer.odometer-theme-minimal.odometer-animating-up .odometer-ribbon-inner,
  .odometer.odometer-auto-theme.odometer-animating-down.odometer-animating
    .odometer-ribbon-inner,
  .odometer.odometer-theme-minimal.odometer-animating-down.odometer-animating
    .odometer-ribbon-inner {
    font-family: inherit;
    font-weight: 300;
    -webkit-transition-duration: 0.75s !important;
    -moz-transition-duration: 0.75s !important;
    -ms-transition-duration: 0.75s !important;
    -o-transition-duration: 0.75s !important;
    transition-duration: 0.75s !important;
  }
</style>

<label class="theme-switch" for="night-mode-toggle">
  <input
    class="control-input"
    name="night-mode-toggle"
    type="checkbox"
    id="night-mode-toggle"
    on:click={toggleTheme} />
  <div class="slider round" />
  <div class="icon sun">
    <!-- <Fa
      icon={faSun}
      color="var(--theme-bg)"
      secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%, 1)" /> -->
  </div>
  <div class="icon moon hidden">
    <!-- <Fa
      icon={faMoon}
      color="var(--theme-fg)"
      secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%, 1)" /> -->
  </div>
</label>
