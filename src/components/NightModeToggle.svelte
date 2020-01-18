<script>
  import { onMount } from "svelte";
  // import { storeViewportSize } from "./../stores.js";

  onMount(() => {
    const currentTheme = localStorage.getItem("theme")
      ? localStorage.getItem("theme")
      : null;

    if (currentTheme) {
      document.documentElement.setAttribute("data-theme", currentTheme);

      if (currentTheme === "dark") {
        toggleSwitch.checked = true;
      }
    }
  });

  const toggleStyles = (e) => {
    console.log(`toggleStyles ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^`);
    if (e.target.checked) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark"); //add this
    } else {
      document.documentElement.setAttribute("data-theme", "light");
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
