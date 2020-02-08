<script>
  import { onMount } from "svelte";
  export let loadingMsg, thisId;

  console.todo = function(msg) {
    console.log(
      ` %c%s%s%s`,
      `color: darkorange; background-color: #1a1a1a; padding: 1rem;`,
      `–<|||  `,
      msg,
      `  |||>–`
    );
  };
  onMount(async () => {
    console.todo(`LoadingSpinner onMount`);
    // debugger;
  });
</script>

<style lang="scss">
  .lds-ripple {
display: inline-block;
    position: absolute;
    width: 1rem;
    height: 1rem;
    top: -.5rem;
    right: -2rem;
  }
  .lds-ripple div {
    position: absolute;
    border: 4px solid #fff;
    opacity: 1;
    border-radius: 50%;
    animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }
  .lds-ripple div:nth-child(2) {
    animation-delay: -0.5s;
  }
  @keyframes lds-ripple {
    0% {
      top: 1rem; // 36px;
      left: 1rem;
      // top: 0px;
      // left: 0px;
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      top: 0px;
      left: 0px;
      width: 2rem; // 72px;
      height: 2rem;
      opacity: 0;
    }
  }

  @keyframes loading-title {
    0% {
      top: 2rem; // 36px;
      left: 2rem;
      // top: 0px;
      // left: 0px;
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      top: 0px;
      left: 0px;
      width: 4rem; // 72px;
      height: 4rem;
      opacity: 0;
    }
  }
</style>

<div class="lds-ripple">
  <div></div>
</div>
