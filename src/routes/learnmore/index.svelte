<script>
  import { onMount } from "svelte";
  // import LearnMoreSideMenu from "./../../components/LearnMoreSideMenu.svelte";
  import LearnMoreTopMenu from "./../../components/LearnMoreTopMenu.svelte";
  import InstructionsMenu from "./../../components/InstructionsMenu.svelte";
  import Section1 from "./../../components/learnmore-rules.svelte";
  import Section2 from "./../../components/learnmore-win.svelte";
  import Section3 from "./../../components/learnmore-features.svelte";
  import Section4 from "./../../components/learnmore-issues.svelte";
  import Section5 from "./../../components/learnmore-development.svelte";
  // import Typewriter from "typewriter-effect/dist/core";
  // import getRandomInteger from "./../../utils/get-random-integer.js";
  import { send, receive } from "./../../crossfade.js";
  // import { fade } from "svelte/transition";
  import Fa from "sveltejs-fontawesome";
  import { faMedal } from "@fortawesome/pro-solid-svg-icons";
  import { faLightbulbOn } from "@fortawesome/pro-solid-svg-icons";
  import { faUsersCrown } from "@fortawesome/pro-solid-svg-icons";
  import { faSwords } from "@fortawesome/pro-solid-svg-icons";
  import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons";
  import { faConstruction } from "@fortawesome/pro-solid-svg-icons";

  // let log1 = (console.todo = function(msg, obj) {
  //   console.log(
  //     ` %c%s%s%s`,
  //     `color: darkorange; background-color: black;`,
  //     `–`,
  //     msg,
  //     `–`,
  //     obj
  //   );
  // });
  onMount(() => {
    // console.log(`LandingPage onMount - window obj `, window);
    // window.onscroll = testOnscroll();
    let content = document.querySelector(".learn-more-wrapper");
    let sapper = document.querySelector("#sapper");
    // sapper.addEventListener("scroll", () => {
    //   watchForScroll();
    // });
    window.addEventListener("scroll", () => {
      watchForScroll();
    });
    console.log(`#sapper el `, sapper);
  });

  function watchForScroll() {
    // console.log(`watchForScroll(e) `, e);
    let mainNavLinks = document.querySelectorAll("a.instructions");
    let mainSections = document.querySelectorAll("main section");
    let lastId;
    let cur = [];
    console.log(
      `InstructionsMenu onMount collections: mainNavLinks `,
      mainNavLinks
    );
    console.log(
      `InstructionsMenu onMount collections: mainSections `,
      mainSections
    );
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
    console.log(`fromTop (window.scrollY): ${fromTop}`);
    mainNavLinks.forEach(link => {
      let section = document.querySelector(link.hash);
      // console.log(`fromTop (window.scrollY): ${fromTop}`);
      // console.log(`section.offsetTop: ${section.offsetTop}`);
      // console.log(`section.offsetHeight: ${section.offsetHeight}`);
      if (
        section.offsetTop <= fromTop + 250 &&
        section.offsetTop + section.offsetHeight > fromTop + 250
      ) {
        link.classList.add("active");
        console.log(
          `inside the scroll watcher, we have a matching link  `,
          link
        );
        console.log(
          `inside the scroll watcher, we have a matching section `,
          section
        );
      } else {
        link.classList.remove("active");
      }
    });
    // });
  }

  function testOnscroll() {
    if (typeof window !== "undefined") {
      console.log(`test native onScroll ${window.scrollY}`);
    }
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
      "header"
      "menu"
      "main";
    // grid-template-columns: 20vw 80vw;
    grid-template-rows: 10vh 10vh auto;
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
      border-radius: 5px;
      width: auto;
      text-decoration: none;
      color: $input-blue;
      border: 3px solid rgba(0, 0, 0, 0);
      border-bottom: 3px solid $input-blue;
      z-index: 9;
      transition: all 0.25s;
      &:hover {
        box-shadow: 0 0 1px 2px rgba(50, 200, 255, 0.5);
        border: 3px solid white;
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
      margin: 1.5rem 0 0.5rem 0;
      color: white;
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
              &.cool {
                color: rgba(50, 200, 255, 1);
                &.bordered {
                  border: 1px solid rgba(50, 200, 255, 1);
                  padding: 0.5rem;
                  margin: 0.5rem 0.5rem 0 0.5rem;
                }
              }
              &.orange {
                color: orange;
                &.bordered {
                  border: 1px solid orange;
                  padding: 0.5rem;
                  margin: 0.5rem 0.5rem 0 0.5rem;
                }
                &.underlined {
                  border-bottom: 1px solid orange;
                  padding: 0.5rem;
                  margin: 0.5rem 0.5rem 0 0.5rem;
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
      margin: 1rem 0 0.5rem 0;
      text-align: center;
      color: orange;
      font-size: 1.5rem;
      width: 100%;
      padding: 0.5rem;
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
        height: 5vh;
        visibility: hidden;
        pointer-events: none;
      }
    }
  }

  .section-wrapper {
    // background: rgba(55, 75, 155, 0.5);
    background: rgba($input-blue, 0.4);
    border-radius: 1rem;
    // outline: 5px solid $input-blue;
    // outline-offset: -15px;
    margin-top: 5vh;
    margin-bottom: 5vh;
    position: relative;
    // padding: 5vh 5vw 5vh 5vw;
    padding: 0.5rem;
    min-height: 78vh;
    width: 100%;
    height: auto;
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
    main.instructions section {
      width: 100vw;
      background: none;
      & .section-wrapper {
        background: none;
      }
    }
    .text-content {
      max-width: 100vw;
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
      margin: 1rem 2rem 1rem 1rem ;
    }
    .learnmore-topmenu-wrapper #home {
      left: 1rem;
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

<!-- <div id="showScroll" /> -->
<!-- <svelte:window on:scroll={watchForScroll} /> -->
<div class="learn-more-wrapper">

  <div class="crossfade-wrapper">
    <LearnMoreTopMenu />

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

    <main
      class="instructions"
      out:send={{ key: 'learn-more' }}
      in:receive={{ key: 'learn-more' }}>

      <section id="how-to-play" class="instructions-section">
        <div class="section-wrapper">
          <Section1 />
        </div>
      </section>
      <!-- 
      <section id="how-to-win" class="instructions-section">
        <div class="section-wrapper">
          <Section2 />
        </div>
      </section> -->

      <section id="ui-and-features" class="instructions-section">
        <div class="section-wrapper">
          <Section3 />
        </div>
      </section>

      <section id="issues-and-gotchas" class="instructions-section">
        <div class="section-wrapper">
          <Section4 />
        </div>
      </section>

      <section id="development-thoughts" class="instructions-section">
        <div class="section-wrapper">
          <Section5 />
        </div>
      </section>

    </main>

  </div>
</div>
