<script>
  import { onMount } from "svelte";
  // import { storeViewportSize } from "./../stores.js";

  const light = "#ededed";
  const dark = "#1a1a1a";
  let elements;
  onMount(() => {
    document.documentElement.style.setProperty("--theme-bg", dark);
    document.documentElement.style.setProperty("--theme-fg", light);
    const page = document.querySelector(".page-container");
    const toggleSwitch = document.querySelector("#night-mode-toggle");
    const currentTheme = localStorage.getItem("theme");
    currentTheme ? localStorage.getItem("theme") : null;
    toggleSwitch.checked = true;
    initStylesDark();
    if (currentTheme) {
      toggleStyles(currentTheme);
      // page.classList = `page-container ${currentTheme}`;
      // page.classList.toggle(currentTheme);
      console.log(`currentTheme from ls exists: ${currentTheme}`);
      document.documentElement.style.setProperty("--theme-bg", dark);
      document.documentElement.style.setProperty("--theme-fg", light);
      if (currentTheme === "light") {
        console.log(`currentTheme from ls is dark: ${currentTheme}`);
        toggleSwitch.checked = false;
        document.documentElement.style.setProperty("--theme-bg", light);
        document.documentElement.style.setProperty("--theme-fg", dark);
      }
    }
  });

  const toggleTheme = e => {
    // const page = document.querySelector(".page-container");
    // const placards = document.querySelectorAll(".scoreboard-player");
    const currentTheme = localStorage.getItem("theme");
    const toggleSwitch = document.querySelector("#night-mode-toggle");

    if (e.target.checked) {
      // page.classList = "page-container dark";
      // toggleSwitch.checked = true;
      document.documentElement.style.setProperty("--theme-bg", dark);
      document.documentElement.style.setProperty("--theme-fg", light);
      localStorage.setItem("theme", "dark");
    } else {
      // page.classList = "page-container light";
      e.target.checked = false;
      document.documentElement.style.setProperty("--theme-bg", light);
      document.documentElement.style.setProperty("--theme-fg", dark);
      localStorage.setItem("theme", "light");
    }
    toggleStyles(currentTheme);
  };

  function toggleStyles(theme) {
    const page = document.querySelector(".page-container");
    const placards = document.querySelectorAll(".scoreboard-player");
    const playerNames = document.querySelectorAll(".player-name");
    const playerMarks = document.querySelectorAll(".player-marker");
    const playerScores = document.querySelectorAll(".total-score-number");
    const settings = document.querySelector(".settings-wrapper");
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
    elements.forEach(el => {
      el.classList.toggle("dark");
      el.classList.toggle("light");
    });
  }

  function initStylesDark() {
    const page = document.querySelector(".page-container");
    const placards = document.querySelectorAll(".scoreboard-player");
    const playerNames = document.querySelectorAll(".player-name");
    const playerMarks = document.querySelectorAll(".player-marker");
    const playerScores = document.querySelectorAll(".total-score-number");
    const settings = document.querySelector(".settings-wrapper");
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
    elements.forEach(el => {
      el.classList.remove("light");
      el.classList.remove("dark");
      el.classList.add("dark");
    });
  }

  // make an addStyles to set initial theme class on each element
</script>

<style lang="scss">
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

  .slider-wrapper {
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
    right: 0.95rem;
    top: 1rem;
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
    background: hsla(var(--player-color-hue), 75%, 50%, 0.5);
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
  @media (min-width: 900px) {
    // .slider:before {
    //   bottom: 3px;
    //   // height: 26px;
    //   left: 5px;
    //   // width: 26px;
    // }

    // input:checked + .slider:before {
    //   transform: translateX(31px);
    // }

    // .slider.round {
    //   border-radius: 34px;
    // }
  }
</style>

<label class="theme-switch" for="night-mode-toggle">
  <input
    class="control-input"
    name="night-mode-toggle"
    type="checkbox"
    id="night-mode-toggle"
    on:click={toggleTheme} />
  <!-- <div class="slider-wrapper"> -->
  <div class="slider round" />
  <!-- </div> -->
  <span class="toggle-text">Dark Mode</span>

</label>
