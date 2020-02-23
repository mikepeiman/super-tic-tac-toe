<script>
  import { onMount } from "svelte";
  // import Typewriter from "typewriter-effect/dist/core";
  // import getRandomInteger from "./../../utils/get-random-integer.js";
  import { send, receive } from "./../crossfade.js";
  import { doScrolling } from "./../utils/smoothScroll.js";
  import { fade } from "svelte/transition";
  import Fa from "sveltejs-fontawesome";
  import { faMedal } from "@fortawesome/pro-solid-svg-icons";
  import { faLightbulbOn } from "@fortawesome/pro-solid-svg-icons";
  import { faUsersCrown } from "@fortawesome/pro-solid-svg-icons";
  import { faSwords } from "@fortawesome/pro-solid-svg-icons";
  import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons";
  import { faConstruction } from "@fortawesome/pro-solid-svg-icons";
  import { faGamepadAlt } from "@fortawesome/pro-solid-svg-icons";
  import { faGameBoard } from "@fortawesome/pro-solid-svg-icons";


  onMount(async () => {

  });

  function watchForScroll(e) {
    console.log(`watchForScroll(e) `, e);
    let subNavLinks = document.querySelectorAll("a.subsection");
    let lastId;
    let cur = [];
    console.log(`InstructionsMenu onMount collections: subNavLinks `, subNavLinks);
    // This should probably be throttled.
    // Especially because it triggers during smooth scrolling.
    // https://lodash.com/docs/4.17.10#throttle
    // You could do like...
    // window.addEventListener("scroll", () => {
    //    _.throttle(doThatStuff, 100);
    // });
    // Only not doing it here to keep this Pen dependency-free.

    // window.addEventListener("scroll", event => {
    let fromTop = window.scrollY;

    subNavLinks.forEach(link => {
      let section = document.querySelector(link.hash);
      console.log(`fromTop (window.scrollY): ${fromTop}`);
      console.log(`section.offsetTop: ${section.offsetTop}`);
      console.log(`section.offsetHeight: ${section.offsetHeight}`);
      if (
        section.offsetTop <= fromTop &&
        section.offsetTop + section.offsetHeight > fromTop
      ) {
        link.classList.add("active");
        console.log(`inside the scroll watched, we have a matching link  `, link);
        console.log(`inside the scroll watched, we have a matching section `, section);
      } else {
        link.classList.remove("active");
      }
    });
    // });
  }

  function setActive(e) {
    console.log(`setActive function deactivated`);
  }
</script>

<style lang="scss">
  :global(.learn-more-wrapper) {
    & .instructions-menu-wrapper {
      &.submenu {
        display: flex;
        justify-content: center;
        top: 3rem;
        position: -webkit-sticky;
        position: fixed;
        width: 100%;
        z-index: 101;
        & .link-wrapper {
          display: flex;
          justify-content: center;
          position: relative;
          z-index: 101;
          width: auto;
        }
        & a {
          &.button {
            &.instructions {
              box-sizing: border-box;
              border-radius: 0;
              margin-right: 0;
              border: none;
              background: #1a1a1a;
              outline: 2px solid rgba(25, 150, 155, 1);
              width: auto;
              outline-offset: -8px;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              color: white;
              font-size: .85rem;
              text-transform: uppercase;
              &.active {

              }
              & svg {
                color: orange;
                width: 1rem;
              }
              &:hover {
                border: none;
                outline: 2px solid orange;
                box-shadow: none;
                // outline-offset: -2px;
                background: #333;
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
        & a.button.instructions.subsection.active {
          color: white;
          outline: 2px solid orange;
          // border-bottom: 2px solid rgba(0, 0, 0, 0) !important;
          background: #1a1a1a;
        }
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
          outline: 2px solid rgba(0, 0, 0, 0);
          outline-offset: -2px;
          & .app-title {
            display: none;
          }
          &:hover {
            background: rgba(25, 50, 175, 1);
            outline: 2px solid orange;
            outline-offset: -2px;
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
          border: 2px solid rgba(0, 0, 0, 0);
          background: rgba(50, 100, 255, 1);
          & svg {
            width: 1.5rem;
            height: 1.5rem;
            margin: 0 1ch;
          }
          &:hover {
            border: 2px solid orange;
            box-shadow: none;
            background: rgba(25, 50, 175, 1);
          }
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
        margin-left: 0;
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

<!-- <svelte:window on:scroll={watchForScroll} /> -->
<div
  class="instructions-menu-wrapper submenu"
  out:send={{ key: 'learn-more' }}
  in:receive={{ key: 'learn-more' }}>
  <div class="link-wrapper">
    <a
      name="how-to-play"
      on:click={e => setActive(e)}
      out:send={{ key: 'how-to-play' }}
      in:receive={{ key: 'how-to-play' }}
      class="button instructions subsection"
      id="how-to-play-winning"
      href="learnmore/#how-to-play_winning">
      <div class="icon swords">
        <!-- <Fa size="lg" icon={faSwords} color="currentColor" /> -->
        <div>Winning</div>
      </div>
    </a>
    <a
      name="gameplay"
      on:click={e => setActive(e)}
      out:send={{ key: 'ui-and-features' }}
      in:receive={{ key: 'ui-and-features' }}
      class="button instructions subsection"
      id="how-to-play-gameplay"
      href="learnmore/#how-to-play_gameplay">
      <div class="icon lightbulb-on">
        <!-- <Fa size="lg" icon={faLightbulbOn} color="currentColor" /> -->
        <div>Gameplay</div>
      </div>
    </a>
    <a
      name="settings"
      on:click={e => setActive(e)}
      out:send={{ key: 'issues-and-gotchas' }}
      in:receive={{ key: 'issues-and-gotchas' }}
      class="button instructions subsection"
      id="how-to-play-settings"
      href="learnmore/#how-to-play_settings">
      <div class="icon exclamation-triangle">
        <!-- <Fa size="lg" icon={faExclamationTriangle} color="currentColor" /> -->
        <div>Settings</div>
      </div>
    </a>
    <a
      name="strategies"
      on:click={e => setActive(e)}
      out:send={{ key: 'development-thoughts' }}
      in:receive={{ key: 'development-thoughts' }}
      class="button instructions subsection"
      id="how-to-play-strategies"
      href="learnmore/#how-to-play_strategies">
      <div class="icon construction">
        <!-- <Fa size="lg" icon={faConstruction} color="currentColor" /> -->
        <div>Strategies</div>
      </div>
    </a>
  </div>

</div>
