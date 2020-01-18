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
    console.log(
      `toggleStyles ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^`,
      e.target
    );
    console.dir(e.target)
    if (e.target.checked) {
      page.classList = "page-container dark";
      document.documentElement.style.setProperty("--theme-bg", "#1a1a1a");
      localStorage.setItem("theme", "dark"); //add this
    } else {
      page.classList = "page-container light";
      console.log(`currentTheme from ls is light: ${currentTheme}`);
      document.documentElement.style.setProperty("--theme-bg", "#efefef");
      localStorage.setItem("theme", "light"); //add this
    }
  };
</script>

<style lang="scss">
  :global(.window button.close) {
    width: 3rem;
    height: 3rem;
    &:before {
      left: 0.5rem;
      width: 2rem;
    }
    &:after {
      left: 0.5rem;
      width: 2rem;
    }
  }

  /*Simple css to style it like a toggle switch*/

  .theme-switch {
    display: inline-block;
    height: 34px;
    position: relative;
    width: 60px;
  }

  .theme-switch input {
    display: none;
  }

  .slider {
    background-color: #ccc;
    bottom: 0;
    cursor: pointer;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transition: 0.4s;
  }

  .slider:before {
    background-color: #fff;
    bottom: 4px;
    content: "";
    height: 26px;
    left: 4px;
    position: absolute;
    transition: 0.4s;
    width: 26px;
  }

  input:checked + .slider {
    background-color: #66bb6a;
  }

  input:checked + .slider:before {
    transform: translateX(26px);
  }

  .slider.round {
    border-radius: 34px;
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
    on:click={toggleStyles} />
  <div class="slider round" />
  <span>Dark Mode</span>

</label>
