<script>
  import { onMount } from "svelte";
  // import { storeViewportSize } from "./../stores.js";

    const light = "#ededed";
    const dark = "#1a1a1a";
  onMount(() => {

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
    const settings = document.querySelector(".settings-wrapper");
    let elements = [page, settings];
    placards.forEach(placard => {
      elements.push(placard);
    });
    elements.forEach(el => {
      el.classList.toggle("dark");
      el.classList.toggle("light");
    });
  }

  function initStylesDark() {
    const page = document.querySelector(".page-container");
    const placards = document.querySelectorAll(".scoreboard-player");
    const settings = document.querySelector(".settings-wrapper");
    let elements = [page, settings];
    placards.forEach(placard => {
      elements.push(placard);
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
    display: flex;
    align-items: center;
    margin-right: 1rem;
  }

  .theme-switch {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 3rem;
    position: relative;
    width: calc(60px + 10ch);
  }

  .theme-switch input {
    display: none;
  }

  .slider-wrapper {
  }

  .toggle-text {
    color: var(--theme-fg);
  }

  .slider {
    background-color: #ccc;
    width: 40px;
    height: 26px;
    bottom: 0;
    cursor: pointer;
    // left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transition: 0.4s;
  }

  .slider:before {
    background-color: #fff;
    bottom: 3px;
    content: "";
    height: 19.5px;
    left: 3px;
    position: absolute;
    transition: 0.4s;
    width: 19.5px;
  }

  input:checked + .slider {
    background-color: hsla(130, 50%, 35%, 1);
  }

  input:checked + .slider:before {
    transform: translateX(13.5px);
  }

  .slider.round {
    border-radius: 25.5px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
  @media (min-width: 900px) {
    :global(#theme-switch-wrapper) {
      display: flex;
      align-items: center;
      margin-right: 2rem;
    }
    .slider {
      background-color: #ccc;
      width: 60px;
      height: 34px;
      bottom: 0;
      cursor: pointer;
      // left: 0;
      position: absolute;
      right: 0;
      top: 0.5rem;
      transition: 0.4s;
    }
    .slider:before {
      bottom: 4px;
      height: 26px;
      left: 4px;
      width: 26px;
    }

    input:checked + .slider:before {
      transform: translateX(26px);
    }

    .slider.round {
      border-radius: 34px;
    }
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
