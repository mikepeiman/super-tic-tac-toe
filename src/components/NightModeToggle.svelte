<script>
  import { onMount } from "svelte";
  import Fa from "sveltejs-fontawesome";
  // import { faSunrise } from "@fortawesome/pro-duotone-svg-icons";
  // import { faSunset } from "@fortawesome/pro-duotone-svg-icons";
  import { faSun } from "@fortawesome/pro-solid-svg-icons";
  import { faMoon } from "@fortawesome/pro-solid-svg-icons";
  // import { storeViewportSize } from "./../stores.js";

  const light = "#edededed";
  const dark = "#1a1a1a";
  let elements;
  onMount(() => {
    document.documentElement.style.setProperty("--theme-bg", dark);
    document.documentElement.style.setProperty("--theme-fg", light);
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
      console.log(
        `toggleTheme() => CHECKED => e.target ${e.target}, checked? ${e.target.checked} `,
        e.target
      );
      console.log(
        `toggleTheme() => is target same as toggleSwitch? ${e.target ==
          toggleSwitch}, toggleSwitch checked? ${toggleSwitch.checked} `,
        toggleSwitch
      );
      toggleSwitch.checked = true;
      e.target.dispatchEvent(new Event('change'))
      console.log(
        `toggleTheme() => ASSIGNED => e.target ${e.target}, checked? ${e.target.checked} `
      );
      console.log(
        `toggleTheme() => is target same as toggleSwitch? ${e.target ==
          toggleSwitch}, toggleSwitch checked? ${toggleSwitch.checked} `
      );
      document.documentElement.style.setProperty("--theme-bg", dark);
      document.documentElement.style.setProperty("--theme-fg", light);
      localStorage.setItem("theme", "dark");
    } else {
      console.log(
        `toggleTheme() => NOT CHECKED => e.target ${e.target}, checked? ${e.target.checked} `,
        e.target
      );
      console.log(
        `toggleTheme() => is target same as toggleSwitch? ${e.target ==
          toggleSwitch}, toggleSwitch checked? ${toggleSwitch.checked} `,
        toggleSwitch
      );
      e.target.checked = false;
      e.target.dispatchEvent(new Event('change'))
      console.log(
        `toggleTheme() => ASSIGNED => e.target ${e.target}, checked? ${e.target.checked} `
      );
      console.log(
        `toggleTheme() => is target same as toggleSwitch? ${e.target ==
          toggleSwitch}, toggleSwitch checked? ${toggleSwitch.checked} `
      );
      document.documentElement.style.setProperty("--theme-bg", light);
      document.documentElement.style.setProperty("--theme-fg", dark);
      localStorage.setItem("theme", "light");
    }
    toggleStyles(currentTheme);
  };

  function toggleStyles(theme) {
    const toggleSwitch = document.querySelector("#night-mode-toggle");
    // toggleSwitch.click()
    // console.log(
    //   `toggleStyles() ====---------------======{   ${theme}   }========>>>>>>>>>>>>>>>>>>>>>> ${theme}`
    // );
    const page = document.querySelector(".page-container");
    const placards = document.querySelectorAll(".scoreboard-player");
    const playerNames = document.querySelectorAll(".player-name");
    const playerMarks = document.querySelectorAll(".player-marker");
    const playerScores = document.querySelectorAll(".total-score-number");
    const settings = document.querySelector(".settings-wrapper");
    const icons = document.querySelectorAll(".icon");
    // console.log(
    //   `toggleStyles() ====---------------====={   icons   }===>>>>>>>>>>>>>>>>>>>>>> ${icons}`
    // );
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
  <!-- <div class="icon sunrise">
    <Fa
      icon={faSunrise}
      color="var(--theme-fg)"
      secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%, 1)" />
  </div>
  <div class="icon sunset hidden">
    <Fa
      icon={faSunset}
      color="var(--theme-fg)"
      secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%, 1)" />
  </div> -->
  <div class="icon sun">
    <Fa
      icon={faSun}
      color="var(--theme-fg)"
      secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%, 1)" />
  </div>
  <div class="icon moon hidden">
    <Fa
      icon={faMoon}
      color="var(--theme-fg)"
      secondaryColor="hsla(calc(var(--player-color-hue) + 60), 60%, 60%, 1)" />
  </div>
  <!-- <span class="toggle-text">Dark Mode</span> -->

</label>
