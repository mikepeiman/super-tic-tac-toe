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

  export let currentSection;
  let submenus = [
    {
      name: "GamePlay",
      sections: [
        {
          name: "winning",
          url: "learnmore#how-to-play_winning"
        },
        {
          name: "gameplay",
          url: "learnmore#how-to-play_gameplay"
        },
        {
          name: "settings",
          url: "learnmore#how-to-play_settings"
        },
        {
          name: "strategies",
          url: "learnmore#how-to-play_strategies"
        }
      ]
    },
    {
      name: "Features",
      sections: [
        {
          name: "Emojis",
          url: "learnmore#features_features1"
        },
        {
          name: "LocalStorage",
          url: "learnmore#features_features2"
        }
      ]
    },
    {
      name: "Issues",
      sections: [
        {
          name: "Responsive Design",
          url: "learnmore#issues_issues1"
        }
      ]
    },
    {
      name: "development",
      sections: [
        {
          name: "User Accounts",
          url: "learnmore#development_development1"
        },
        {
          name: "Multiplayer",
          url: "learnmore#development_development2"
        },
        {
          name: "Advanced Gameplay",
          url: "learnmore#development_development3"
        },
        {
          name: "Developer Course",
          url: "learnmore#development_development4"
        }
      ]
    }
  ];

  // $: {
  //   if (typeof window !== "undefined") {
  //     console.log(`reactive logging currentSection ${currentSection}`);
  //     let submenuContainer = document.querySelector(".link-sub-wrapper");
  //     console.log(`reactive logging submenuContainer `, submenuContainer);
  //     if (currentSection === 0) {
  //       console.log(
  //         `reactive logging currentSection matches 0: ${currentSection}`
  //       );
  //       submenuContainer.style = "justify-content: flex-start;";
  //     } else if (currentSection === 1) {
  //       console.log(
  //         `reactive logging currentSection matches 1: ${currentSection}`
  //       );
  //       submenuContainer.style = "justify-content: flex-end;";
  //     } else if (currentSection === 2) {
  //       console.log(
  //         `reactive logging currentSection matches 2: ${currentSection}`
  //       );
  //       submenuContainer.style = "justify-content: center;";
  //     } else if (currentSection === 3) {
  //       console.log(
  //         `reactive logging currentSection matches 3: ${currentSection}`
  //       );
  //       submenuContainer.style = "justify-content: space-between;";
  //     }
  //   }
  // }

  onMount(async () => {});

  function watchForScroll(e) {
    console.log(`watchForScroll(e) `, e);
    let subNavLinks = document.querySelectorAll("a.subsection");
    let lastId;
    let cur = [];
    console.log(
      `InstructionsMenu onMount collections: subNavLinks `,
      subNavLinks
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
        console.log(
          `inside the scroll watched, we have a matching link  `,
          link
        );
        console.log(
          `inside the scroll watched, we have a matching section `,
          section
        );
      } else {
        link.classList.remove("active");
      }
    });
    // });
  }

  function setActive(e) {
    console.log(`setActive function deactivated`);
  }

  function setStyle() {
    if (currentSection === 0) {
      return "layout-start";
    } else if (currentSection === 1) {
      return "layout-space";
    } else if (currentSection === 2) {
      return "layout-center";
    } else if (currentSection === 3) {
      return "layout-end";
    }
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
        // grid-template-columns: 16.6vw 1fr 15.6vw;
        // grid-template-areas: ". smenu .";
        background: #1a1a1a;
        border-bottom: 2px solid orange;
        & .link-wrapper {
          grid-area: smenu;
          display: flex;
          justify-content: center;
          position: relative;
          z-index: 101;
          width: 100%;

          & .link-sub-wrapper {
            // opacity: 0;
            // width: 0;
            // pointer-events: none;
            display: flex;
            // height: 2rem;

            justify-content: center;
            // left: 0;
            transition: all 0.5s;
            // position: relative;
            // transform: translateX(0);
            // transform: matrix(0, -1, 0, 0, 1, 0);
            // transform: matrix(1, 0, 0, -1, 0, 0);
            // backface-visibility: hidden;
            &.active {
              opacity: 1;
              // width: 100%;
              pointer-events: all;
              // transform: matrix(1, 0, 0, 1, 0, 0);
              // animation: .5s submenu;
              & a {
                &.button {
                  &.instructions {
                    &.active {
                      background: darkorange;
                    }
                  }
                }
              }
            }
          }
        }
        & a {
          &.button {
            &.instructions {
              box-sizing: border-box;
              border-radius: 0;
              margin-right: 0;
              border: none;
              background: #1a1a1a;
              // outline: 2px solid rgba(25, 150, 155, 1);
              // border-bottom: 2px solid orange;
              width: auto;
              outline-offset: -7px;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              color: white;
              font-size: 0.85rem;
              text-transform: uppercase;
              opacity: 0;

              &.subsection {
                font-weight: 300;
                & * {
                  pointer-events: none;
                  // & div {
                  //   pointer-events: none;
                  // }
                }
                &.current-section {
                  opacity: 1;
                  left: 0;
                  transition: all 0.125s;
                }
                &.active {
                  color: #1a1a1a;
                  // outline: 2px solid orange;
                  font-weight: 400;
                  background: orange;
                  // border-bottom: 2px solid rgba(0, 0, 0, 0) !important;
                  // border-bottom: 2px solid rgba(25, 150, 155, 1);
                  transition: all 0.125s;
                }
              }

              & svg {
                color: orange;
                width: 1rem;
              }
              &:hover {
                // border: none;
                // outline: 2px solid white;
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
        // & a.button.instructions.subsection.active {
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

  @media screen and (max-width: 900px) {
    #layout-main .learn-more-wrapper .instructions-menu-wrapper.submenu {
      & .link-sub-wrapper {
        display: flex;
        height: 2rem;
        line-height: 0.8rem;
        font-size: 0.8rem;
        width: 0%;
        justify-content: center;
        left: 0;
        transition: all 0.25s;
        position: relative;
        // transform: translateX(0vw);
        &.active {
          width: 100%;
          background: #1a1a1a;
          z-index: 99;
        }
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

  @keyframes submenu {
    0% {
      transform: matrix(1, 0, 0, -1, 0, 0);
      color: red;
      opacity: 1;
    }
    20% {
      transform: matrix(1, 0, 0, 1, 0, 0);
    }
    50% {
      opacity: 0;
    }
    100% {
      color: green;
      opacity: 1;
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
<div class="instructions-menu-wrapper submenu" id="scrollmenu-sub">
  <div class="link-wrapper">
    {#each submenus as submenu, m}
      <!-- {#if m === currentSection} -->
      <div
        class:active={m === currentSection}
        class="link-sub-wrapper layout-{m}">
        {#each submenus[m].sections as item, i}
          <a
            name="{submenu.name}_{item.name}"
            data-id={i}
            class="scroll button instructions subsection current-section"
            href={item.url}>
            <div class="icon">
              <div>{item.name}</div>
            </div>
          </a>
        {/each}
      </div>
      <!-- {/if} -->
    {/each}
  </div>
</div>
