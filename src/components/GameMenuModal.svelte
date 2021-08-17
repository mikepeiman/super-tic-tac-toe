<script>
  import { onMount, getContext } from "svelte";
  import GameMenuModalContent from "./GameMenuModalContent.svelte";
  import { storeViewportSize } from "./../stores.js";
  import Fa from "sveltejs-fontawesome";
  // import { faBars } from "js/all.js"
  import { storeButtonStyles } from "../stores.js";
  let { _color, _secondaryColor, _secondaryOpacity } = $storeButtonStyles;

  const { open } = getContext("simple-modal");
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
    }
  };
  let vWidth;

  onMount(() => {
    storeViewportSize.subscribe(val => {
      // console.log(`storeViewportSize from GameMenuModal: `, val);
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
    open(GameMenuModalContent, { message: "Game Controls:" }, styling);
    // console.log(`showModal ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^`);
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

<button class="control-button" id="game-menu-button" on:click={showModal}>
  <!-- <Fa
    icon={faBars}
    color={_color}
    secondaryColor={_secondaryColor}
    secondaryOpacity={_secondaryOpacity} /> -->
  <div>Menu</div>
</button>
