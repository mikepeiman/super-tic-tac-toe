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
    storeMovesRemaining,
    storeToggleAutoFillFinalTurn
  } from "../stores.js";
  // import { storeViewportSize } from "./../stores.js";

  const light = "#efefefef";
  const dark = "#1a1a1a";
  let elements,
    viewport,
    autofill;

  onMount(() => {
    const toggleSwitch = document.querySelector("#autofill-toggle");
    autofill ? localStorage.getItem("toggleAutoFillFinalTurn") : true;
    toggleSwitch.checked = true;
    initStylesDark();
    if (autofill) {
      console.log(`autofill from ls true: ${autofill}`);

      if (autofill === false) {
        // toggleStyles(autofill);
        console.log(`autofill from ls is false: ${autofill}`);
        toggleSwitch.checked = false;

      }
    }

  });

  const toggleTheme = e => {
    const autofill = localStorage.getItem("theme");
    const toggleSwitch = document.querySelector("#night-mode-toggle");

    if (e.target.checked) {
      toggleSwitch.checked = true;
      e.target.dispatchEvent(new Event("change"));
      localStorage.setItem("theme", "dark");
    } else {
      e.target.checked = false;
      e.target.dispatchEvent(new Event("change"));
      localStorage.setItem("theme", "light");
    }
    toggleStyles(autofill);
  };

  function toggleStyles(theme) {
    const toggleSwitch = document.querySelector("#night-mode-toggle");
 
  }

  function initStylesDark() {
 
  }

</script>

<style lang="scss">
  /*Simple css to style it like a toggle switch*/
#theme-switch-wrapper {
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

<label class="autofill-toggle" for="autofill-toggle">
  <input
    class="control-input"
    name="autofill-toggle"
    type="checkbox"
    id="autofill-toggle"
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
