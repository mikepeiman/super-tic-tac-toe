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

  let log1 = (console.todo = function(msg, obj) {
    console.log(
      ` %c%s%s%s`,
      `color: black; background-color: rgba(55,75,155,.25); padding: 0.5rem;`,
      `–`,
      msg,
      `–`,
      obj
    );
  });
  let log2 = (console.todo = function(msg, obj) {
    console.log(
      ` %c%s%s%s`,
      `color: black; background-color: rgba(155,75,105,.25); padding: 0.5rem;`,
      `–`,
      msg,
      `–`,
      obj
    );
  });
  onMount(async () => {
    // let body = document.getElementsByTagName("body");
    log1(`InstructionsMenu onMount`);
    // watchForScroll("onMount")
  });

  function watchForScroll(e) {
    console.log(`watchForScroll(e) `, e);
    let mainNavLinks = document.querySelectorAll("a.instructions");
    let mainSections = document.querySelectorAll("main section");
    let lastId;
    let cur = [];
    log1(`InstructionsMenu onMount collections: mainNavLinks `, mainNavLinks);
    log1(`InstructionsMenu onMount collections: mainSections `, mainSections);
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

    mainNavLinks.forEach(link => {
      let section = document.querySelector(link.hash);
      log2(`fromTop (window.scrollY): ${fromTop}`);
      log2(`section.offsetTop: ${section.offsetTop}`);
      log2(`section.offsetHeight: ${section.offsetHeight}`);
      if (
        section.offsetTop <= fromTop &&
        section.offsetTop + section.offsetHeight > fromTop
      ) {
        link.classList.add("active");
        log1(`inside the scroll watched, we have a matching link  `, link);
        log1(`inside the scroll watched, we have a matching section `, section);
      } else {
        link.classList.remove("active");
      }
    });
    // });
  }

  function enter(e) {
    let svg = e.target.firstChild;
    log1(`enter() e `, svg);
    svg.classList.toggle("active");
  }
  function leave(e) {
    let svg = e.target.firstChild;
    log1(`leave() e `, svg);
    svg.classList.toggle("active");
  }
  function findTargetByNodeName(el, soughtNodeName) {
    let node = el.nodeName;
    if (node !== soughtNodeName) {
      log2(`This is not the node you are looking for`, node);
      el = el.parentElement;
      findTargetByNodeName(el, soughtNodeName);
    }
    node = el.nodeName;
    log2(`returning from findTargetByNodeName(el, soughtNodeName) `, el);
    if (node !== soughtNodeName) {
      log2(`This is not the node you are looking for`, node);
      el = el.parentElement;
      findTargetByNodeName(el, soughtNodeName);
      // el.parentElement.classList.toggle("active");
    }
    return el;
  }

  function setActive(e) {
    console.log(`setActive function deactivated`);

    //   let el = e.target;
    //   let navs = document.querySelectorAll(".button.instructions");
    //   log1(`all instructions nav buttons `, navs);
    //   navs.forEach(nav => {
    //     nav.classList.remove("active");
    //   });
    //   let node = el.nodeName;
    //   let soughtNodeName = "A";
    //   el = findTargetByNodeName(el, soughtNodeName);
    //   node = el.nodeName;
    //   if (node !== "A") {
    //     log1(`This is not the node you are looking for`, node);
    //     el = findTargetByNodeName(el, soughtNodeName);
    //   } else {
    //     el.classList.add("active");
    //   }
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
            // border-bottom: 2px solid rgba(0, 0, 0, 0);
            border-bottom: 2px solid rgba(50, 100, 255, 1);
            width: 16.6vw;
            outline-offset: 0px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            color: white;
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
      & a.button.instructions.active {
        color: white;
        // border-bottom: 2px solid orange !important;
        border-bottom: 2px solid rgba(0,0,0,0) !important;
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

<!-- <svelte:window on:scroll={watchForScroll} /> -->
<div
  class="instructions-menu-wrapper"
  out:send={{ key: 'learn-more' }}
  in:receive={{ key: 'learn-more' }}>
  <a
    out:send={{ key: 'title' }}
    in:receive={{ key: 'title' }}
    rel="prefetch"
    class="icon-wrapper"
    href="/">
    <img id="app-icon" src="favicon.png" alt="" />
    <div class="app-title">Super Tic-Tac-Toe</div>
  </a>
  <div class="link-wrapper">
    <a
      name="how-to-play"
      on:click={e => setActive(e)}
      out:send={{ key: 'how-to-play' }}
      in:receive={{ key: 'how-to-play' }}
      class="button instructions"
      id="how-to-play-button"
      href="learnmore/#how-to-play">
      <div class="icon swords">
        <Fa size="lg" icon={faSwords} color="currentColor" />
        <div>How To Play</div>
      </div>
    </a>
    <a
      name="features"
      on:click={e => setActive(e)}
      out:send={{ key: 'ui-and-features' }}
      in:receive={{ key: 'ui-and-features' }}
      class="button instructions"
      id="ui-and-features-button"
      href="learnmore/#ui-and-features">
      <div class="icon lightbulb-on">
        <Fa size="lg" icon={faLightbulbOn} color="currentColor" />
        <div>UI & Features</div>
      </div>
    </a>
    <a
      name="issues"
      on:click={e => setActive(e)}
      out:send={{ key: 'issues-and-gotchas' }}
      in:receive={{ key: 'issues-and-gotchas' }}
      class="button instructions"
      id="issues-and-gotchas-button"
      href="learnmore/#issues-and-gotchas">
      <div class="icon exclamation-triangle">
        <Fa size="lg" icon={faExclamationTriangle} color="currentColor" />
        <div>Issues</div>
      </div>
    </a>
    <a
      name="development"
      on:click={e => setActive(e)}
      out:send={{ key: 'development-thoughts' }}
      in:receive={{ key: 'development-thoughts' }}
      class="button instructions"
      id="development-thoughts-button"
      href="learnmore/#development-thoughts">
      <div class="icon construction">
        <Fa size="lg" icon={faConstruction} color="currentColor" />
        <div>Development</div>
      </div>
    </a>
  </div>
  <a
    out:send={{ key: 'play-now' }}
    in:receive={{ key: 'play-now' }}
    rel="prefetch"
    class="button"
    id="play-now"
    href="tictactoe/">
    <Fa size="lg" icon={faGameBoard} color="currentColor" />
    <!-- <Fa size="lg" icon={faGamepadAlt} color="currentColor" /> -->
    <div>PLAY NOW!</div>
  </a>
</div>
