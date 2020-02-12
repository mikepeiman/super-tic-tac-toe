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

    window.addEventListener("scroll", event => {
      let fromTop = window.scrollY;

      mainNavLinks.forEach(link => {
        let section = document.querySelector(link.hash);

        if (
          section.offsetTop <= fromTop &&
          section.offsetTop + section.offsetHeight > fromTop
        ) {
          link.classList.add("current");
        } else {
          link.classList.remove("current");
        }
      });
    });
  });

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
    let el = e.target;
    let navs = document.querySelectorAll(".button.instructions");
    log1(`all instructions nav buttons `, navs);
    navs.forEach(nav => {
      nav.classList.remove("active");
    });
    let node = el.nodeName;
    let soughtNodeName = "A";
    // log1(`setActive() e.target nodeName ${node}`, svg);
    el = findTargetByNodeName(el, soughtNodeName);
    node = el.nodeName;
    if (node !== "A") {
      log1(`This is not the node you are looking for`, node);
      el = findTargetByNodeName(el, soughtNodeName);
      // el.parentElement.classList.toggle("active");
    } else {
      // el.classList.remove("active");
      // let list = el.classList;
      // log1(`classlist `, list);
      // list.push = "active";
      // log1(`classlist `, list);
      el.classList.add("active");
    }
    //
    // }
    // svg.classList.toggle("active");
  }
</script>

<style lang="scss">
  :global(.learn-more-wrapper) {
    & .instructions-menu-wrapper {
      grid-area: menu;
      display: -webkit-box;
      display: flex;
      justify-content: center;
      position: sticky;
      z-index: 101;
      top: 0;
      width: 100%;
      background: black;
      & a {
        &.button {
          border-bottom: 5px solid rgba(50, 200, 255, .1);
          &.instructions {
            border-radius: 0;
            margin-right: 1rem;

            width: 12vw;
            outline: 3px solid #1a1a1a;
            outline-offset: -3px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            &:hover {
              border-bottom: 5px solid orange;
              box-shadow: none;
              color: orange;
              & svg {
                color: orange;
                transition: all 0.25s;
              }
              // outline: 3px solid #1a1a1a;
            }
            &.active {
              color: white;
              border-bottom: 5px solid orange;
              outline: 3px solid orange;
              background: #1a1a1a;
            }
          }
        }
      }
    }
  }
  .button.instructions {
    & svg {
      transition: all 0.25s;
      color: blue;
    }
    &:hover {
      // color: greenyellow;
      & svg {
        transition: all 0.25s;
        color: pink;
      }
    }
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
</style>

<div
  class="instructions-menu-wrapper"
  out:send={{ key: 'learn-more' }}
  in:receive={{ key: 'learn-more' }}>
  <a
    name="how-to-win"
    on:click={e => setActive(e)}
    out:send={{ key: 'how-to-win' }}
    in:receive={{ key: 'how-to-win' }}
    class="button instructions"
    id="how-to-win-button"
    href="learnmore/#how-to-win">
    <div class="icon users-crown">
      <Fa size="lg" icon={faUsersCrown} color="currentColor" />
      <div>How To Win</div>
    </div>
  </a>

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
