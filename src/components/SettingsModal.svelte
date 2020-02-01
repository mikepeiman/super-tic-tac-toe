<script>
  import { onMount, getContext } from "svelte";
  import GameSettingsModalContent from "./GameSettingsModalContent.svelte";
  import { storeViewportSize, storeToggleConfiguration } from "./../stores.js";
  import Fa from "sveltejs-fontawesome";
  import { faSlidersH } from "@fortawesome/pro-duotone-svg-icons";
  import { storeButtonStyles } from "../stores.js";
  let { _color, _secondaryColor, _secondaryOpacity } = $storeButtonStyles;

  const { open } = getContext("simple-modal");
  // margin: "5vh 5vw",
  let styling = {
    window: {
      background: "none",
      padding: "2rem",
      width: "100%",
      maxWidth: "100vw",
      maxHeight: "100vh",
      margin: 0,
      background: "rgba(0,0,0,0.7)",
      transition: "all .5s",
      overflow: "hidden"
    },
    close: {
      width: "3rem",
      height: "3rem"
    },
    content: {
      borderRadius: "5px",
      display: "grid",
      gridTemplateRows: "3rem auto 1fr",
      gridTemplateAreas: `"title"
        "buttons"
        "content"`,
      width: "100%",
      overflow: "hidden"
    }
  };
  let vWidth;

  onMount(() => {
    storeViewportSize.subscribe(val => {
      console.log(`storeViewportSize from GameMenuModal: `, val);
      vWidth = val.width;
    });

    if (vWidth < 900) {
      styling = {
        window: {
          background: "none",
          padding: "2.5rem",
          width: "100%",
          maxWidth: "90vw",
          maxHeight: "90vh",
          margin: "5vh 5vw",
          background: "rgba(0,0,0,0.7)"
        },
        close: {
          width: "3rem",
          height: "3rem"
        },
        content: {
          padding: "2rem",
          borderRadius: "5px",
          background: "#1a1a1a"
        }
      };
    }
    if (vWidth < 600) {
      styling = {
        window: {
          background: "none",
          padding: "0",
          width: "100%",
          maxWidth: "90vw",
          maxHeight: "90vh",
          margin: "5vh 5vw",
          background: "rgba(0,0,0,0.7)"
        },
        close: {
          width: "3rem",
          height: "3rem"
        },
        content: {
          padding: "2rem",
          borderRadius: "5px",
          background: "#1a1a1a"
        }
      };
    }
  });

  const showModal = () => {
    open(GameSettingsModalContent, { message: "Game Settings:" }, styling);
    console.log(`showModal ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^`);
    // storeToggleConfiguration.set(false);
  };
</script>

<style lang="scss">
  :global(.window button.close) {
    width: 3rem;
    height: 3rem;
    background: darkorange;
    &:before {
      left: 0.5rem;
      width: 2rem;
    }
    &:after {
      left: 0.5rem;
      width: 2rem;
    }
    &:hover {
      background: var(--theme-fg);
      color: var(--theme-bg);
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
    }
  }
  // :global(.window-wrap .window.expand) {
  //   min-height: 90vh;
  //   transition: all .5s;
  // }
</style>

<button class="control-button" id="settings-menu-button" on:click={showModal}>
  <Fa
    icon={faSlidersH}
    color={_color}
    secondaryColor={_secondaryColor}
    secondaryOpacity={_secondaryOpacity} />
  Settings
</button>
