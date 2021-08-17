<script>
  import { onMount } from "svelte";
  // import LearnMoreSideMenu from "./../../components/LearnMoreSideMenu.svelte";
  import LearnMoreTopMenu from "./../../components/LearnMoreTopMenu.svelte";
  import InstructionsMenu from "./../../components/InstructionsMenu.svelte";
  import InstructionsSubMenu from "./../../components/InstructionsSubMenu.svelte";
  import Section1 from "./../../components/learnmore-rules.svelte";
  // import Section2 from "./../../components/learnmore-win.svelte";
  import Section3 from "./../../components/learnmore-features.svelte";
  import Section4 from "./../../components/learnmore-issues.svelte";
  import Section5 from "./../../components/learnmore-development.svelte";
  // import Typewriter from "typewriter-effect/dist/core";
  // import getRandomInteger from "./../../utils/get-random-integer.js";
  import { send, receive } from "./../../crossfade.js";
  // import { fade } from "svelte/transition";
  import Fa from "sveltejs-fontawesome";
  // import { faMedal } from "js/all.js"
  // import { faLightbulbOn } from "js/all.js"
  // import { faUsersCrown } from "js/all.js"
  // import { faSwords } from "js/all.js"
  // import { faExclamationTriangle } from "js/all.js"
  // import { faConstruction } from "js/all.js"
  import { throttle } from "./../../utils/_throttle.js";
  let sectionTops = [],
    sum;
  let scrollCompleted = false;
  let mainSectionTops = [],
    subSectionTops = [];
  let currentSection = 0;
  onMount(() => {
    // [...document.querySelectorAll('a[href^="#"]')].map(
    //   x => (x.href = document.location + new URL(x.href).hash)
    // );

    document.querySelectorAll("a").forEach(a => {
      if (!a.hash || !document.querySelectorAll(a.hash).length) return;
      let loc = JSON.stringify(window.location.href);
      let sw = loc.split("#");
      // let sw2 = sw.split(",")
      console.log(
        `window object for .location ${window.location} etc, and a.hash ${a.hash}`
      );
      console.dir(window);
      console.log(`window object split on # ${sw} ||| sw2 `);
      console.log(`window object length ${sw.length} `);
      console.log(`window object root ${sw[0]} `);
      console.log(
        `window.origin ${window.origin} + window.pathname ${window.pathname} + a.hash ${a.hash};`
      );
      // if(){}
      a.href = window.location.origin + window.location.pathname + a.hash;
      // a.href = window.location + a.hash;
    });

    // if (window.location.hash) {
    //   var hash = window.location.hash;
    //   hash = hash.slice(1);
    //   let el = document.getElementById(`${hash}`);
    //   let elTop = el.offsetTop;
    //   console.log(`WINDOW LOCATION HASH ${hash} top: ${elTop}`, el);

    //   window.scroll({
    //     top: elTop,
    //     behavior: "auto"
    //   });
    // }

    window.addEventListener("scroll", () => {
      // throttle(reactToScrollEvent(), 25);
      scrollThrottle(reactToScrollEvent(), 10);
    });
    initSectionHeightsArray();
    setScrollClickEvents();
    if (window.location.hash) {
      simpleScrollOnLoad();
    }
    scrollCompleted = true;
  });

  function setScrollClickEvents() {
    const links = document.querySelectorAll(".scroll");
    console.log(`setScrollClickEvents .scroll anchors: `, links);
    links.forEach(each => (each.onclick = simpleScroll));
  }

  function simpleScrollOnLoad() {
    console.log(`simpleScroll(e) window.location ${window.location}`, window);
    document.documentElement.style = "scroll-behavior: auto;";
    let href = window.location.hash;
    href = href.slice(1);
    let el = document.getElementById(href);
    console.log(`looking for ${href} element `, el);
    let mainStr;
    if (href.includes("_")) {
      mainStr = getSectionFromHref(href, "#", "_");
    } else {
      mainStr = getSectionFromHref(href, "#", "");
    }

    let main = mainSectionTops.find(x => x.str === mainStr);
    let subStr = "not found",
      sub;

    console.log(`str from href ${mainStr}`);
    if (el.classList.contains("subsection")) {
      subStr = getSectionFromHref(href, "_", "");
      sub = subSectionTops.find(x => x.subStr === subStr);
      console.log(`sub: top ${sub.top}`, sub);
      // window.scroll({
      //   top: main.top,
      //   behavior: "auto"
      // });
      window.scroll({
        top: sub.top + 110,
        behavior: "auto"
      });
    } else {
      console.log(`main: top ${main.top}`, main);
      window.scroll({
        top: main.top,
        behavior: "auto"
      });
    }
    document.documentElement.style = "scroll-behavior: smooth;";
    console.log(`str from href sub ${subStr}`);
  }

  function simpleScroll(e) {
    console.log(
      `simpleScroll(e) window.scrollY ${window.scrollY} target href ${e.target.href} id ${e.target.id}`,
      e.target
    );
    let href = e.target.href;
    let mainStr;
    if (href.includes("_")) {
      mainStr = getSectionFromHref(href, "#", "_");
    } else {
      mainStr = getSectionFromHref(href, "#", "");
    }

    let main = mainSectionTops.find(x => x.str === mainStr);
    let subStr = "not found",
      sub;

    console.log(`str from href ${mainStr}`);
    if (e.target.classList.contains("subsection")) {
      subStr = getSectionFromHref(href, "_", "");
      sub = subSectionTops.find(x => x.subStr === subStr);
      console.log(`sub: top ${sub.top}`, sub);
      // window.scroll({
      //   top: main.top,
      //   behavior: "smooth"
      // });
      window.scroll({
        top: sub.top,
        behavior: "smooth"
      });
    } else {
      console.log(`main: top ${main.top}`, main);
      window.scroll({
        top: main.top,
        behavior: "smooth"
      });
    }

    console.log(`str from href sub ${subStr}`);
  }

  function getSectionFromHref(str, a, b) {
    let mySubString = str.substring(str.lastIndexOf(a) + 1, str.lastIndexOf(b));
    return mySubString;
  }

  function initSectionHeightsArray() {
    let subNavLinks = document.querySelectorAll("a.instructions.subsection");
    let fromTop = window.scrollY;
    let sectionHeights = [];
    let mainNavLinks = document.querySelectorAll("a.instructions.mainsection");

    mainNavLinks.forEach((link, i) => {
      let href = link.href;
      let str = getSectionFromHref(href, "#", "");
      let section = document.querySelector(link.hash);
      if (section) {
        let top = section.offsetTop;
        link.setAttribute("data-top", top);
        let id = section.id;
        mainSectionTops = [
          ...mainSectionTops,
          { top: top, id: id, href: href, str: str }
        ];
      }
    });
    subNavLinks.forEach((link, i) => {
      let section = document.querySelector(link.hash);
      let href = link.getAttribute("href");
      let mainStr = getSectionFromHref(href, "#", "_");
      let subStr = getSectionFromHref(href, "_", "");
      let main = mainSectionTops.find(x => x.str === mainStr);
      let sub = mainSectionTops.find(x => x.str === subStr);
      if (mainSectionTops.some(x => x.str === mainStr)) {
        // console.log(
        //   `found a match for sublink ${href} with parent, main `,
        //   main
        // );
      }
      if (section) {
        sectionHeights.push(section.offsetHeight);
        // console.log(
        //   `section.offsetTop ${section.offsetTop} + main.top ${main.top}`
        // );
        let top = section.offsetTop + main.top;
        let id = section.id;
        // console.log(`subsection el ${section.id} `, section);
        console.log(section);
        console.dir(section);
        link.setAttribute("data-top", top);
        subSectionTops = [
          ...subSectionTops,
          { top: top, id: id, href: href, mainStr: mainStr, subStr: subStr }
        ];
        // console.table('each link', link.href, 'i', i, 'section', section.id)
        // console.table(section.offsetTop, ' <=', fromTop + positionAdjustment1, ' --- (section.offsetTop',section.offsetTop,' fromTop', fromTop, '+', positionAdjustment1, ')')
        // console.table(section.offsetTop + section.offsetHeight, ' > ', fromTop + positionAdjustment2, ' --- (section.offsetTop', section.offsetTop, '+ section.offsetHeight ', section.offsetHeight, ' > fromTop', fromTop, '+', positionAdjustment2, ')')

        // link.onclick = function() {
        //   window.scroll({
        //     top: top,
        //     behavior: "smooth"
        //   });
        // };
      }
    });
    // console.log(`sectionHeights array `, sectionHeights);
    // sectionTops = sectionHeights.map(val => (sum = (sum || 0) + val));
    // console.log(`sectionTops array `, sectionTops);
    // console.log(`mainSectionTops array `, mainSectionTops);
    // console.log(`subSectionTops array `, subSectionTops);
  }
  function reactToScrollEvent() {
    let mainNavLinks = document.querySelectorAll("a.instructions.mainsection");
    let subNavLinks = document.querySelectorAll("a.instructions.subsection");
    let lastId;
    let positionAdjustment1 = 250;
    let positionAdjustment2 = 300;
    let fromTop = window.scrollY;
    let sectionHeights = [];
    mainNavLinks.forEach((link, i) => {
      let section = document.querySelector(link.hash);
      if (
        section.offsetTop <= fromTop + positionAdjustment1 &&
        section.offsetTop + section.offsetHeight > fromTop + positionAdjustment2
      ) {
        currentSection = i;
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
    positionAdjustment1 = 0;
    positionAdjustment2 = 100;

    subNavLinks.forEach((link, i) => {
      let section = document.querySelector(link.hash);

      if (section) {
        let thisTop = link.getAttribute("data-top");
        // console.log(
        //   `link href ${
        //     link.href
        //   } data-top attribute of link anchor ${link.getAttribute(
        //     "data-top"
        //   )} section.offsetTop ${
        //     section.offsetTop
        //   } window.scrollY ${fromTop} section.offsetTop + section.offsetHeight ${section.offsetTop +
        //     section.offsetHeight}`
        // );

        if (thisTop <= fromTop + positionAdjustment1) {
          // console.log(
          //   `CONDITION #1 ||| TRUE!!!! thisTop <= fromTop + positionAdjustment1`
          // );
        } else {
          // console.log(
          //   `CONDITION #1 ||| FALSE!!!! thisTop <= fromTop + positionAdjustment1`
          // );
        }
        // console.log(
        //   `CONDITION #1 ||| ${thisTop} <= ${fromTop} + ${positionAdjustment1}`
        // );

        if (thisTop > fromTop - section.offsetHeight + positionAdjustment2) {
          // console.log(
          //   `CONDITION #2 ||| TRUE!!!! thisTop > fromTop - section.offsetHeight + positionAdjustment2`
          // );
        } else {
          // console.log(
          //   `CONDITION #2 ||| FALSE!!!! section.offsetTop + section.offsetHeight > fromTop + positionAdjustment2`
          // );
        }
        // console.log(
        //   `CONDITION #2 ||| ${section.offsetTop} + ${section.offsetHeight} > ${fromTop} + ${positionAdjustment2}`
        // );

        if (
          thisTop <= fromTop + positionAdjustment1 &&
          thisTop > fromTop - section.offsetHeight + positionAdjustment2
        ) {
          console.log(
            `\nDOUBLE TRUE!!!! DOUBLE TRUE!!!! DOUBLE TRUE!!!! DOUBLE TRUE!!!! DOUBLE TRUE!!!! DOUBLE TRUE!!!!\n `
          );
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      }
    });

    // subNavLinks.forEach((link, i) => {
    //   let section = document.querySelector(link.hash);
    //   if (section) {
    //     if (
    //       section.offsetTop <= fromTop + positionAdjustment1 &&
    //       section.offsetTop + section.offsetHeight >
    //         fromTop + positionAdjustment2
    //     ) {
    //       link.classList.add("active");
    //     } else {
    //       link.classList.remove("active");
    //     }
    //   }
    // });

    // console.table("each link", link.href, "i", i, "section", section.id);
    // console.table(
    //   section.offsetTop,
    //   " <=",
    //   fromTop + positionAdjustment1,
    //   " --- (section.offsetTop",
    //   section.offsetTop,
    //   " fromTop",
    //   fromTop,
    //   "+",
    //   positionAdjustment1,
    //   ")"
    // );
    // console.table(
    //   section.offsetTop + section.offsetHeight,
    //   " > ",
    //   fromTop + positionAdjustment2,
    //   " --- (section.offsetTop",
    //   section.offsetTop,
    //   "+ section.offsetHeight ",
    //   section.offsetHeight,
    //   " > fromTop",
    //   fromTop,
    //   "+",
    //   positionAdjustment2,
    //   ")"
    // );

    //   }
    // });
    //  ***************************************
    // if (
    //   section.offsetTop <= fromTop + positionAdjustment1 &&
    //   section.offsetTop + section.offsetHeight >
    //     fromTop + positionAdjustment2
    // ) {

    // link.classList.add("active");
    // } else {
    //   link.classList.remove("active");
    // }

    // console.log(`sectionHeights array `, sectionHeights)
    // let sectionTops = [], sum;
    // sectionTops = sectionHeights.map(val =>  sum = (sum || 0) + val )
    // console.log(`sectionTops array `, sectionTops)
  }

  function scrollThrottle(func, interval) {
    let lastY = 0;
    return function() {
      let here = window.scrollY;
      if (lastY + interval < here) {
        lastY = here;
        return func.apply(this, arguments);
      }
    };
  }
</script>

<style lang="scss" global>
  $input-blue: rgba(50, 200, 255, 1);
  html {
    scroll-behavior: smooth;
  }
  body {
    overflow-x: hidden;
    // scroll-behavior: smooth;
  }

  #sapper {
    // overflow-x: hidden;
    // scroll-behavior: smooth;
  }
  .homepage-wrapper {
    & h1#page-title {
      top: 0;
      opacity: 1;
      z-index: 10;
      color: white;
      background: none;
      margin: 7.5vh 0 2vh 0;
      border-bottom: 6px solid $input-blue;
    }
  }
  .crossfade-wrapper {
    position: absolute;
    min-width: 100vw;
    min-height: 100vh;
    display: flex;
    top: 0;
    left: 0;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-areas:
      "menu"
      "submenu"
      "main";
    // grid-template-columns: 20vw 80vw;
    grid-template-rows: 3rem 2rem auto;
    //     outline: 2px solid #32c8ff;
    // outline-offset: -10px;
    background: #1a1a1a;
    & .learnmore-topmenu-wrapper,
    .learnmore-sidemenu-wrapper {
      z-index: 99;
      display: -webkit-box;
      display: flex;
      justify-content: space-around;
      -webkit-box-align: start;
      align-items: flex-start;
      top: 0;
      justify-self: center;
      align-self: center;
      // left: 3px;
      position: absolute;
      width: 100%;
    }
  }
  .crossfade-item {
    position: absolute;
    // transition: all 0.25s;
  }

  .learn-more-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: #1a1a1a;
    min-width: 100vw;
    min-height: 100vh;
    & .main-content {
      position: absolute;
      top: 25vh;
      justify-self: center;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    & #typewriter {
      font-size: 2rem;
      padding: 0;
      margin: 0;
    }
    & .game-info {
      position: absolute;
      left: 25vw;
      right: 25vw;
      top: 25vh;
      overflow: hidden;
      margin-right: 5vw;
    }
    & .learnmore-sidemenu-wrapper {
      position: absolute;
      left: 1rem;
      top: 25vh;
      width: 10rem;
      display: flex;
      justify-content: space-around;
      flex-direction: column;
    }
    & img {
      grid-area: content-image;
      width: 85%;
      position: relative;
      top: 1rem;
      z-index: 0;
    }

    & .button {
      padding: 0.5rem 1rem;
      // background: #1a1a9a9a;
      // border-radius: 5px;
      width: auto;
      text-decoration: none;
      color: $input-blue;
      // border: 3px solid rgba(0, 0, 0, 0);
      // border-bottom: 3px solid $input-blue;
      z-index: 9;
      transition: all 0.25s;
      &:hover {
        // box-shadow: 0 0 1px 2px rgba(50, 200, 255, 0.5);
        // border: 3px solid white;
        color: white;
        transition: all 0.25s;
        & svg {
          // color: pink;
          // transition: all .25s;
        }
      }
      &.side-menu {
        grid-area: menu;
        position: static;
        width: 12vw;
        // margin: 0.75rem 1rem 0 0;
        padding: 0.75rem 1rem;
      }
      & span {
        background: rgba(119, 94, 94, 0.25);
        font-weight: 300;
        padding: 0 1ch;
        &.nice {
          color: rgba(140, 255, 140, 0.75);
        }
        &.note {
          color: rgba(255, 140, 140, 0.75);
        }
        &.cool {
          color: rgba(50, 200, 255, 1);
          font-weight: 700;
        }
        &.bold {
          font-weight: 700;
        }
        &.underline {
          border-bottom: 1px solidrgba(0, 0, 0, 0.75);
        }
      }
    }
    & h1,
    h2,
    h3,
    figure,
    & p {
      text-align: center;
      margin: 0 auto;
      color: #efefefef;
    }
    & li {
      color: #efefefef;
    }

    & h1 {
      font-size: 2.8rem;
      text-transform: uppercase;
      font-weight: 700;
      margin: 0 0 0.5em 0;
    }
    & h2 {
      font-size: 2.1rem;
      text-transform: uppercase;
      font-weight: 700;
      padding: 1.5rem 0 2rem 0;
      color: white;
      // text-shadow: 0 0 2px white;
      margin: 0;
      // background: rgba(0, 0, 0, 0.5);
      // border-bottom: 3px solid white;
      border-radius: 1rem 1rem 0 0;
      width: 100%;
    }

    & hr {
      border: 0;
      border-bottom: 3px solid rgba(50, 200, 255, 1);
      background: rgba(0, 0, 0, 0.5);
      margin: 2rem;
    }
    $imageW: 100vw;
    $imageH: 100vh;

    & figure {
      position: absolute;
      opacity: 1;
      display: flex;
      margin: 0;
      top: 0vh;
      left: 0;
      min-width: $imageW;
      min-height: $imageH;
      width: $imageW;
      height: 100%;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
      z-index: 0;
      &#bg-from-landing-page {
        opacity: 0;
        z-index: -1;
      }
      &#bg-light-fade-in {
        z-index: 9;
      }
      &::before {
        content: "";
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        min-width: $imageW;
        min-height: $imageH;
        width: $imageW;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        outline: 2px solid #32c8ff;
        outline-offset: -10px;
      }

      & figcaption {
        margin: -2.25rem 0 2rem 0;
        padding: 0;
        z-index: 9;
        color: #555;
        visibility: hidden;
      }
    }
  }
  #final-button {
    box-shadow: 0 0 3px 4px rgba(50, 200, 255, 0.25);
    margin: 1rem 0 5rem 0;
    &:hover {
      box-shadow: 0 0 4px 5px rgba(50, 200, 255, 0.5);
      transition: all 0.45s;
    }
  }

  #play-now,
  #learn-more {
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.45s;
    z-index: 10;
    & svg {
      fill: darkorange;
    }
  }
  #home {
    left: 2rem;
    top: 2rem;
  }
  #page-title {
    top: 2rem;
    z-index: 9;
    border-bottom: 3px solid rgba(50, 200, 255, 1);
  }
  #play-now {
    right: 2rem;
    top: 2rem;
  }

  #learn-more {
    top: 60%;
  }

  .two-columns {
    display: grid;
    grid-template-columns: 40vw 40vw;
  }
  .text-content {
    grid-area: text;
    max-width: 80vw;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    & .subsection {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin-top: -16vh;
      &:last-child {
        min-height: 80vh;
      }
      &::before {
        display: block;
        content: "";
        margin-top: 0vh;
        height: 16vh;
        visibility: hidden;
        pointer-events: none;
      }
      & .mixed-content-block,
      & .text-content-block {
        display: grid;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 1rem;
        grid-template-rows: 4rem auto;
        margin: 2.5rem;
        & h4 {
          grid-area: title;
          width: auto;
          text-align: center;
          font-size: 1.25rem;
          font-weight: 400;
          padding: 1rem;
          margin: 0.5rem 0 0 0;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          color: #efefef;
          border-bottom: 1px solid orange;
        }
        & img {
          grid-area: visual;
          width: 100%;
          margin-top: 1rem;
          top: 0;
        }
        & .text-sub-block {
          grid-area: textcontent;

          & img.icon {
            position: relative;
            width: 1rem;
            height: 1rem;
            top: 2px;
            filter: brightness(1) invert(1) opacity(0.9);
            &.bordered {
              border: 1px solid rgba(50, 200, 255, 1);
              padding: 0.5rem;
              margin: 0.5rem 0.5rem 0 0.5rem;
            }
          }
          & p {
            text-align: right;
            font-weight: 300;
            margin: 1rem;
            padding: 0 0 2rem 0;
          }
          & .text-image-block {
            display: grid;
            grid-template-areas: "textcontent imagecontent";
            grid-template-columns: 1fr 1fr;
            width: 100%;
            // border-top: 1px solid orange;
            // border-bottom: 1px solid orange;
            margin: 1rem 0;
            & img {
              grid-area: imagecontent;
              padding: 0 0 0 1rem;
              margin: 0;
              box-sizing: border-box;
            }
            & p {
              grid-area: textcontent;
              margin: 0;
              padding: 1rem;
              background: rgba(0, 0, 0, 0.5);
              /* border-radius: .5rem; */
            }
            // &:nth-child(even) {
            //   grid-template-areas: "imagecontent textcontent";
            // }
          }
          & span {
            font-weight: 400;
            padding: 0 1ch;
            display: block;
            margin: 0.5rem 0.5rem 0 0.5rem;
            &.nice {
              color: rgba(140, 255, 140, 0.75);
            }
            &.note {
              color: rgba(255, 140, 140, 0.75);
            }
            &.orange {
              color: rgba(255, 165, 0, 1);
              &.bordered {
                border: 1px solid orange;
                position: relative;
                padding: 0.75rem;
                margin: 2rem;
                z-index: 0;
                border-radius: 0.5rem;
                display: block;
                font-weight: 400;
                font-size: 1.1rem;
                text-align: center;
                text-shadow: 1px 1px black;
                color: white;
                background: repeating-linear-gradient(
                  45deg,
                  orange 0.25rem,
                  orange 0.5rem,
                  #3264ff 0,
                  #3264ff 1rem
                );
                & span {
                  z-index: 99;
                  margin: 0;
                  padding: 0;
                }
                &::before {
                  content: "";
                  position: absolute;
                  z-index: 1;
                  top: -1px;
                  left: 0;
                  width: 100%;
                  height: 105%;
                  background: rgba(0, 0, 0, 0.5);
                  background: linear-gradient(
                    45deg,
                    rgba(255, 165, 0, 0.5) 0%,
                    rgba(50, 100, 255, 1) 40% 60%,
                    rgba(255, 165, 0, 0.5) 100%
                  );
                  border-radius: 0.5rem;
                  z-index: -1;
                }
                &::after {
                  content: "";
                  position: absolute;
                  z-index: 1;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background: rgba(0, 0, 0, 0.5);
                  box-shadow: inset 0 0 10px -3px rgba(255, 255, 255, 0.5),
                    0 0 10px -3px rgba(0, 0, 0, 0.5);
                  border-radius: 0.5rem;
                  z-index: -1;
                }
              }
            }
            &.bold {
              font-weight: 700;
            }
            &.underline {
              border-bottom: 1px solidrgba(0, 0, 0, 0.75);
            }
          }
        }

        &:nth-child(odd) {
          grid-template-areas: "title title" "visual textcontent";
          & .text-sub-block {
            grid-area: textcontent;
            & p {
              text-align: left;
              margin: 1rem;
              padding: 0 0 2rem 0;
            }
          }
        }
      }
      & .text-content-block {
        grid-template-areas: "title" "textcontent";
        grid-template-columns: 1fr;
        & h4 {
          text-align: left;
        }
        & .text-sub-block {
          grid-area: textcontent;
          & p {
            text-align: left;
            margin: 1rem;
            padding: 0;
          }
        }
      }
      & .mixed-content-block {
        grid-template-areas: "title title" "textcontent visual";
        grid-template-columns: 1fr 1fr;
      }
    }
    & h3 {
      // border-top: 1px solid orange;
      border-bottom: 1px solid orange;
      text-transform: uppercase;
      margin: 1rem 0;
      text-align: center;
      color: orange;
      font-size: 1.5rem;
      width: 100%;
      padding: 0.5rem 0;
      background: rgba(0, 0, 0, 0.5);
      // border-radius: 0 0 4px 4px;
      justify-self: center;
      //   margin: -.25rem;
      // border-radius: 1rem 1rem 0 0;
    }
    & li {
      margin-left: 2rem;
    }
  }

  .learnmore-sidemenu-wrapper a {
    & .icon {
      display: flex;
      display: grid;
      grid-template-areas: "content-icon content-text";
      grid-template-columns: 3rem 1fr;
      justify-content: flex-start;
      align-items: center;
      font-size: 1rem;
      & svg {
        grid-area: content-icon;
        font-size: 2rem;
        margin-right: 1rem;
      }
      & div {
        grid-area: content-text;
      }
    }
  }
  .landing-page-wrapper {
    & #home {
      left: 2rem;
      top: 2rem;
    }
    & #page-title {
      top: 2rem;
      z-index: 9;
      border-bottom: 3px solid rgba(50, 200, 255, 1);
    }
    & #play-now {
      top: 40%;
      right: auto;
      left: auto;
    }

    & #learn-more {
      top: 60%;
      right: auto;
      left: auto;
    }
  }

  main.instructions {
    scroll-behavior: smooth;
    grid-area: main;
    display: flex;
    flex-direction: column;
    z-index: 99;
    width: 100vw;
    justify-content: center;
    align-items: center;
    margin-bottom: 40vh;
    & section {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      width: 75vw;
      min-height: 78vh;
      margin-top: -10vh;

      // &:last-child {
      //   min-height: 80vh;
      //   & .section-wrapper {
      //     min-height: 80vh;
      //   }
      // }

      &::before {
        display: block;
        content: "";
        margin-top: 0vh;
        height: 10vh;
        visibility: hidden;
        pointer-events: none;
      }
    }
  }

  .section-wrapper {
    // background: rgba(55, 75, 155, 0.5);
    background: rgba(50, 100, 255, 1);
    border-radius: 1rem;
    // outline: 5px solid $input-blue;
    // outline-offset: -15px;
    margin-top: 5vh;
    margin-bottom: 5vh;
    position: relative;
    // border: 3px solid orange;
    padding: 0;
    min-height: 78vh;
    width: 100%;
    height: auto;
    & .heading {  
      color: white;
    }
    & .subtext {
      padding: 1.5rem;
      border-radius: 1rem;
      margin: 2.5rem auto;
      background: rgba(0,0,0,0.5);
      font-weight: 300;
      max-width: 80%;
      // background: rgba(36, 33, 197, 0.75);
    }
  }

  hr {
    margin: 5h;
    padding: 5vh;
  }

  // **********************************************************************************************************
  // **********************************************************************************************************
  // **********************************************************************************************************

  @media screen and (max-width: 900px) {
    body {
      font-size: 90%;
    }
    #layout-main {
      & .learn-more-wrapper {
        & .crossfade-wrapper {
          grid-template-rows: 12vh 6vh auto;
          & .instructions-menu-wrapper {
            display: grid;
            grid-template-areas: "icon playnow" "scrollmenu scrollmenu";
            grid-template-rows: 6vh 6vh;
            justify-content: space-around;
            // border-bottom: 2px solid rgba(50, 100, 255, 1);
            &.submenu {
              display: flex;
              grid-area: submenu;
              top: 12vh;
            }
            & .icon-wrapper {
              grid-area: icon;
              width: 50vw;
              text-decoration: none;
              color: white;
              // border-radius: 0 0 1rem 0;
              & .app-title {
                display: block;
                margin-left: 1rem;
                text-transform: uppercase;
              }
              & img#app-icon {
                width: 1.5rem;
              }
            }
            & .link-wrapper {
              grid-area: scrollmenu;
              width: 98vw;
              justify-content: center;
              // border-bottom: 2px solid rgba(50, 100, 255, 0);
              & a.button.instructions {
                width: 25vw;
              }
            }
            & a#play-now {
              grid-area: playnow;
              width: 50vw;
              // border-radius: 0 0 0 1rem;
            }
          }
        }
      }
      main.instructions section {
        width: 100vw;
        background: none;
        & .section-wrapper {
          background: none;
          & .subtext {
            max-width: 100%;
            margin: 2.5rem;
          }
        }
      }
      .text-content {
        max-width: 100vw;
      }
    }
  }

  // **********************************************************************************************************
  // **********************************************************************************************************
  // **********************************************************************************************************

  @media screen and (max-width: 600px) {
    body {
      font-size: 80%;
    }
    .crossfade-wrapper
      .learnmore-topmenu-wrapper
      .learnmore-topmenu-wrapper
      #page-title {
      top: 1.5rem;
      font-size: 1.25rem;
    }
    .text-content .subsection .mixed-content-block,
    .text-content .subsection .text-content-block {
      margin: 1rem 2rem 1rem 1rem;
    }
    .learnmore-topmenu-wrapper #home {
      left: 1rem;
    }
    .text-content .subsection .mixed-content-block {
      grid-template-areas:
        "title"
        "visual"
        "textcontent";
      grid-template-columns: 1fr;
    }
  }
  // **********************************************************************************************************
  // **********************************************************************************************************
  // **********************************************************************************************************

  @media screen and (max-height: 600px) {
    .learn-more-wrapper {
      justify-content: space-between;
      & .crossfade-wrapper {
        grid-template-rows: 3rem 3rem auto;
        & main.instructions section {
          width: 100%;
          &:before {
            height: 8vh;
          }
          & .section-wrapper {
            background: none;
            outline: none;
            margin-top: 5vh;
            margin-bottom: 5vh;
            position: relative;
            padding: 0;
            min-height: 78vh;
            width: 100%;
            display: flex;
            height: auto;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
          }
          & .text-content {
            font-size: 0.85rem;
            max-width: 100%;
            & .subsection .text-content-block .text-sub-block {
              & p {
                font-size: 0.85rem;
                & span {
                  display: block;
                  margin: 0.5rem 0;
                }
              }
            }
          }
          & h2 {
            font-size: 1.5rem;
            color: white;
            border-bottom: 2px solid #efefef;
          }
        }
      }
    }
  }

  @media (max-width: 600px) {
  }

  @media (min-width: 960px) {
  }
</style>

<div class="learn-more-wrapper">

  <div class="crossfade-wrapper">
    <!-- <LearnMoreTopMenu /> -->

    <figure
      id="bg-from-landing-page"
      out:send={{ key: 'bg-from-landing-page' }}
      in:receive={{ key: 'bg-from-landing-page' }}>
      <img
        id="tictactoe-game"
        alt="A screenshot of a completed game of Super Tic Tac Toe"
        src="game-dark-2pl.png" />
      <!-- <figcaption>A screenshot of a completed game</figcaption> -->
    </figure>
    <InstructionsMenu />
    <InstructionsSubMenu {currentSection} />

    <main
      class="instructions"
      out:send={{ key: 'learn-more' }}
      in:receive={{ key: 'learn-more' }}>

      <section id="how-to-play" class="instructions-section">
        <div class="section-wrapper">
          <Section1 />
        </div>
      </section>

      <section id="features" class="instructions-section">
        <div class="section-wrapper">
          <Section3 />
        </div>
      </section>

      <section id="issues" class="instructions-section">
        <div class="section-wrapper">
          <Section4 />
        </div>
      </section>

      <section id="development" class="instructions-section">
        <div class="section-wrapper">
          <Section5 />
        </div>
      </section>

    </main>

  </div>
</div>
