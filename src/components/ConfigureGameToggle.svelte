<script>
  import { onMount, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import Fa from "sveltejs-fontawesome";
  // import { faSunrise } from "js/all.js"
  // import { faSunset } from "js/all.js"
  // import { faSun } from "js/all.js"
  // import { faMoon } from "js/all.js"
  import { storeToggleConfiguration } from "../stores.js";

  const light = "#edededed";
  const dark = "#1a1a1a";
  let elements, viewport;
  onMount(() => {
    storeToggleConfiguration.subscribe(val => {
      console.log(`storeToggleConfiguration subscription val ${val}`)
    })
  });

  const toggleTheme = e => {
    console.log(
      `configureGameToggle component => toggleTheme() => toggle checked? ${e.target.checked} `
    );
    storeToggleConfiguration.set(e.target.checked)
    dispatch("toggleConfiguration", e.target.checked);
  };
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
    content: "Slider Content";
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
  <div class="slider round" />
</label>
