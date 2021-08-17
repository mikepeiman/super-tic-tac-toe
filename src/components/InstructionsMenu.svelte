<script>
  import { onMount } from "svelte";
  // import Typewriter from "typewriter-effect/dist/core";
  // import getRandomInteger from "./../../utils/get-random-integer.js";
  import { send, receive } from "./../crossfade.js";
  import { doScrolling } from "./../utils/smoothScroll.js";
  import { fade } from "svelte/transition";
  import Fa from "sveltejs-fontawesome";
  // import { faMedal } from "js/all.js"
  // import { faLightbulbOn } from "js/all.js"
  // import { faUsersCrown } from "js/all.js"
  // import { faSwords } from "js/all.js"
  // import { faExclamationTriangle } from "js/all.js"
  // import { faConstruction } from "js/all.js"
  // import { faGamepadAlt } from "js/all.js"
  // import { faGameBoard } from "js/all.js"

  onMount(() => {});

  function clicked(e) {
    console.log(`clicked main scrollmenu item ${e.target.id}`, e.target);
  }
</script>

<style lang="scss">
  :global(.learn-more-wrapper) {
    & .instructions-menu-wrapper {
      grid-area: menu;
      display: -webkit-box;
      display: flex;
      justify-content: flex-end;
      position: sticky;
      z-index: 101;
      top: 0;
      width: 100%;
      background: #333;
      // grid-template-columns: 16.6vw 1fr 16.6vw;
      // grid-template-areas: ". smenu .";
      &.submenu {
        grid-area: submenu !important;
      }
      & .link-wrapper {
        display: flex;
        justify-content: center;
        position: sticky;
        z-index: 101;
        top: 0;
        width: inherit;
      }
      // background: black;
      // border-bottom: 10px solid #1a1a1a;
      & a {
        &.button {
          &.instructions {
            box-sizing: border-box;
            border-radius: 0;
            margin-right: 0;
            border: none;
            // border: 2px solid rgba(0, 0, 0, 0);
            // border-bottom: 2px solid rgba(50, 100, 255, 1);
            width: fill-available;
            outline-offset: 0px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            color: white;
            &.mainsection {
              border-bottom: 2px solid orange;
              & * {
                pointer-events: none;
              }
            }
            &.mainsection[class*=" svelte-"].active {
              color: white;
              border-bottom: 2px solid rgba(0, 0, 0, 0);
              background: #1a1a1a;
              border-left: 2px solid orange;
              border-right: 2px solid orange;
              &:hover {
                border-bottom: 2px solid rgba(0, 0, 0, 0);
                border-left: 2px solid orange;
                border-right: 2px solid orange;
              }
            }
            & svg {
              color: orange;
            }
            &:hover {
              border: none;
              border-bottom: 2px solid orange;
              box-shadow: none;
              background: rgba(0, 0, 0, 0.25);
              color: orange;
              & svg {
                color: orange;
                transition: all 0.25s;
              }
              // outline: 3px solid #1a1a1a;
            }
          }
        }
      }
      // & a.button.instructions.mainsection.active {
      //   color: white;
      //   border-bottom: 2px solid rgba(0, 0, 0, 0);
      //   background: #1a1a1a;
      //   border-left: 2px solid orange;
      //   border-right: 2px solid orange;
      // }
      & .icon-wrapper {
        width: 16.6vw;
        height: auto;
        background: rgba(50, 100, 255, 1);
        position: static;
        left: 0;
        justify-content: center;
        display: flex;
        align-items: center;
        justify-self: flex-start;
        transition: all 0.25s;
        // outline: 2px solid rgba(0, 0, 0, 0);
        // outline-offset: -2px;
        border-radius: 0;
        border-bottom: 2px solid orange;
        &#landing-page {
          // border-right: 2px solid orange;
          // border-radius: 0 0 5px 0;
        }
        &#play-now {
          // border-left: 2px solid orange;
          // border-radius: 0 0 0 5px;
        }
        & .app-title {
          display: none;
        }
        &:hover {
          background:#1932af;
          // outline: 2px solid orange;
          // outline-offset: -2px;
          transition: all 0.25s;
          & img {
            // border: 2px solid orange;
          }
        }
        & img#app-icon {
          width: 2rem;
          justify-content: center;
          display: flex;
          align-items: center;
          position: static;
        }
        & svg {
          color: darkorange;
          fill: darkorange;
        }
      }

      & a#play-now {
        right: 2rem;
        width: 16.6vw;
        color: white;
        border-radius: 0;
        top: 0;
        position: static;
        justify-self: flex-end;
        height: 100%;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        // border: 2px solid rgba(0, 0, 0, 0);
        border-bottom: 2px solid orange;
        background: rgba(50, 100, 255, 1);
        & svg {
          width: 1.5rem;
          height: 1.5rem;
          margin: 0 1ch;
        }
        &:hover {
          background: rgba(25, 50, 175, 1);
        }
      }
    }
  }
  .button.instructions {
    &:hover svg {
      color: orange;
    }
    & .icon {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-radius: 0;
      // width: 8rem;

      & div {
        margin-left: 1rem;
      }
    }
  }
  @media screen and (max-width: 600px) {
    .instructions-menu-wrapper {
      & a.button.instructions {
        margin-right: 0;
        &:hover svg {
          color: orange;
        }
        & .icon {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          border-radius: 0;
          // width: 8rem;

          & div {
            margin-left: 0.5rem;
          }
        }
      }
    }
  }

  @media screen and (max-height: 600px) {
    .learn-more-wrapper {
      & .crossfade-wrapper {
        & .instructions-menu-wrapper {
          height: 100%;
          & a.button.instructions {
            font-size: 0.75rem;
            outline: none;
            margin: 0 1vw 0 0;
            padding: 0.25rem;
            width: auto;
            &:hover {
              outline: 2px solid #1a1a1a;
            }
            & .icon div {
              margin-left: 0.25rem;
            }
            & svg {
              margin: 0.25rem;
              font-size: 0.75rem;
            }
          }
        }
      }
    }
  }
</style>

<div
  class="instructions-menu-wrapper"
  id="scrollmenu-main"
  out:send={{ key: 'learn-more' }}
  in:receive={{ key: 'learn-more' }}>
  <a
    out:send={{ key: 'title' }}
    in:receive={{ key: 'title' }}
    on:click={clicked}
    rel="prefetch"
    class="icon-wrapper button"
    id="landing-page"
    href="/">
    <img id="app-icon" src="favicon.png" alt="" />
    <div class="app-title">Super Tic-Tac-Toe</div>
  </a>
  <div class="link-wrapper">
    <a
      name="how-to-play"
      out:send={{ key: 'how-to-play' }}
      in:receive={{ key: 'how-to-play' }}
      class="scroll button instructions mainsection"
      id="how-to-play-button"
      href="learnmore/#how-to-play">
      <div class="icon swords">
        <!-- <Fa size="lg" icon={faSwords} color="currentColor" /> -->
        <div>How To Play</div>
      </div>
    </a>
    <a
      name="features"
      out:send={{ key: 'ui-and-features' }}
      in:receive={{ key: 'ui-and-features' }}
      class="scroll button instructions mainsection"
      id="ui-and-features-button"
      href="learnmore/#features">
      <div class="icon lightbulb-on">
        <!-- <Fa size="lg" icon={faLightbulbOn} color="currentColor" /> -->
        <div>UI & Features</div>
      </div>
    </a>
    <a
      name="issues"
      out:send={{ key: 'issues-and-gotchas' }}
      in:receive={{ key: 'issues-and-gotchas' }}
      class="scroll button instructions mainsection"
      id="issues-and-gotchas-button"
      href="learnmore/#issues">
      <div class="icon exclamation-triangle">
        <!-- <Fa size="lg" icon={faExclamationTriangle} color="currentColor" /> -->
        <div>Issues</div>
      </div>
    </a>
    <a
      name="development"
      out:send={{ key: 'development-thoughts' }}
      in:receive={{ key: 'development-thoughts' }}
      class="scroll button instructions mainsection"
      id="development-thoughts-button"
      href="learnmore/#development">
      <div class="icon construction">
        <!-- <Fa size="lg" icon={faConstruction} color="currentColor" /> -->
        <div>Development</div>
      </div>
    </a>
  </div>
  <a
    out:send={{ key: 'play-now' }}
    in:receive={{ key: 'play-now' }}
    rel="prefetch"
    class="icon-wrapper button"
    id="play-now"
    href="tictactoe/">
    <!-- <Fa size="lg" icon={faGameBoard} color="currentColor" /> -->
    <!-- <Fa size="lg" icon={faGamepadAlt} color="currentColor" /> -->
    <div>PLAY NOW!</div>
  </a>
</div>
