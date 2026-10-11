<script>
  import { onMount, getContext } from "svelte";
  import PlayerDetailsModalContent from "./PlayerDetailsModalContent.svelte";
  import { storeViewportSize } from "./../stores.js";
  import Fa from "sveltejs-fontawesome";
  // import { faSlidersH } from "js/all.js"
  import { storeButtonStyles } from "../stores.js";
  let { _color, _secondaryColor, _secondaryOpacity } = $storeButtonStyles;

  const { open } = getContext("simple-modal");
  let styling = {
    window: {
      background: "none",
      padding: "5rem"
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
          padding: "2.5rem"
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
          padding: "0"
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
    open(PlayerDetailsModalContent, { message: "Player Details:" }, styling);
    console.log(`showModal ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^`);
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
</style>

<button class="control-button" id="settings-menu-button" on:click={showModal}>
  <!-- <Fa
    icon={faSlidersH}
    color={_color}
    secondaryColor={_secondaryColor}
    secondaryOpacity={_secondaryOpacity} /> -->
  Settings
</button>
