<script>
  import { onMount } from "svelte";
  // import { storeViewportSize } from "./../stores.js";

  onMount(() => {
    const page = document.querySelector(".page-container");
    const toggleSwitch = document.querySelector("#night-mode-toggle");
    const currentTheme = localStorage.getItem("theme");
    console.log(`currentTheme from ls: ${currentTheme}`)
      ? localStorage.getItem("theme")
      : null;

    if (currentTheme) {
      page.classList = `page-container ${currentTheme}`;
      console.log(`currentTheme from ls exists: ${currentTheme}`);
      // document.documentElement.setAttribute("data-theme", currentTheme);
      document.documentElement.style.setProperty("--theme-bg", "#efefef");
      if (currentTheme === "dark") {
        console.log(`currentTheme from ls is dark: ${currentTheme}`);
        toggleSwitch.checked = true;
        // toggleSwitch.setAttribute("checked", true)
        document.documentElement.style.setProperty("--theme-bg", "#1a1a1a");
      }
    }
  });

  const toggleStyles = e => {
    const page = document.querySelector(".page-container");
    const currentTheme = localStorage.getItem("theme");
    const toggleSwitch = document.querySelector("#night-mode-toggle");
    console.log(
      `toggleStyles ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^`,
      e.target
    );
    console.dir(e.target);
    if (e.target.checked) {
      page.classList = "page-container dark";
      // toggleSwitch.checked = true;
      document.documentElement.style.setProperty("--theme-bg", "#1a1a1a");
      localStorage.setItem("theme", "dark"); //add this
    } else {
      page.classList = "page-container light";
      e.target.checked = false;
      console.log(`currentTheme from ls is light: ${currentTheme}`);
      document.documentElement.style.setProperty("--theme-bg", "#efefef");
      localStorage.setItem("theme", "light"); //add this
    }
  };
</script>

<style lang="scss">
  /*Simple css to style it like a toggle switch*/

  .theme-switch {
    display: flex;
    justify-content: space-between;
    flex-flow: row-reverse;
    align-items: center;
    height: 34px;
    position: relative;
    width: calc(60px + 10ch);
  }

  .theme-switch input {
    display: none;
  }

  .slider-wrapper {
  }

  .toggle-text {
    position: absolute;
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
    background-color: #66bb6a;
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
    .slider {
      background-color: #ccc;
      width: 60px;
      height: auto;
      bottom: 0;
      cursor: pointer;
      // left: 0;
      position: absolute;
      right: 0;
      top: 0;
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
    on:click={toggleStyles} />
  <!-- <div class="slider-wrapper"> -->
  <div class="slider round" />
  <!-- </div> -->
  <span class="toggle-text">Dark Mode</span>

</label>
