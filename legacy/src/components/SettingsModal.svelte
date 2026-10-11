<script>
  import { onMount, getContext } from "svelte";
  import GameSettingsModalContent from "./GameSettingsModalContent.svelte";
  import { storeViewportSize, storeToggleConfiguration } from "./../stores.js";
  import Fa from "sveltejs-fontawesome";
  // import { faSlidersH } from "js/all.js"
  import { storeButtonStyles } from "../stores.js";
  let { _color, _secondaryColor, _secondaryOpacity } = $storeButtonStyles;

  const { open } = getContext("simple-modal");
  // margin: "5vh 5vw",
  let styling = {
    window: {
      background: "none",
      padding: "0 1rem 0 0",
      width: "100%",
      maxWidth: "100vw",
      maxHeight: "100vh",
      margin: 0,
      background: "rgba(0,0,0,0.7)",
      transition: "all .5s",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "center"
    },
    close: {
      width: "3rem",
      height: "3rem"
    },
    content: {
      borderRadius: "5px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      width: "70%",
      display: "grid",
      gridTemplateRows: "3rem auto 1fr",
      gridTemplateAreas: `"title"
        "buttons"
        "content"`
    }
  };

  // content {}
  // display: "grid",
  // gridTemplateRows: "3rem auto 1fr",
  // gridTemplateAreas: `"title"
  //   "buttons"
  //   "content"`,
  //

  let vWidth;

  onMount(() => {
    storeViewportSize.subscribe(val => {
      vWidth = val.width;
    });

    if (vWidth < 900) {
      styling = {
        content: {
          width: "100%"
        }
      };
    }
  });

  const showModal = () => {
    open(GameSettingsModalContent, { message: "Game Settings:" }, styling);
    // console.log(`showModal ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^`);
    // storeToggleConfiguration.set(false);
  };
</script>

<style lang="scss">
  :global(.window button.close) {
    width: 3rem;
    height: 3rem;
    background: darken(#32c8ff, 30%);
    &:before {
      left: 0.5rem;
      width: 2rem;
      background: var(--theme-bg);
    }
    &:after {
      left: 0.5rem;
      width: 2rem;
      background: var(--theme-bg);
    }
    &:hover {
      background: darkorange;
      color: var(--theme-bg);
      &:before {
        background: var(--theme-bg);
      }
      &:after {
        background: var(--theme-bg);
      }
    }
  }
  :global(.window-wrap) {
    margin: 0 !important;
    width: 100vw;
    height: 100vh;
    & .window {
      min-height: 100vh;
      min-width: 100vw;
      transition: all 0.5s;
      background: rgba(0,0,0,0.7);
    }
  }
  // :global(.window-wrap .window.expand) {
  //   min-height: 90vh;
  //   transition: all .5s;
  // }
</style>

<button class="control-button" id="settings-menu-button" on:click={showModal}>
  <!-- <Fa
    icon={faSlidersH}
    color={_color}
    secondaryColor={_secondaryColor}
    secondaryOpacity={_secondaryOpacity} /> -->
  <div>Settings</div>
</button>
