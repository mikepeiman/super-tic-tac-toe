<script>
import {onMount, createEventDispatcher} from 'svelte'
// import { createEventDispatcher } from 'svelte';
export let id, settings

const dispatch = createEventDispatcher();
onMount(() => {
  let hue = id[3]
  let alpha = id[1]
  console.log(`Cell component onMount, settings: `, settings)
  customBg = `--custom-bg: hsla(${id[3]*20+120}, 50%, 50%, ${id[1]/10})`
  // console.log(`Cell => onMount, this: `, this)
})

function moveNotification() {
  dispatch('move',id)
}

</script>

<style lang="scss">
  .gameboard-board {
    margin: 2rem;
    display: flex;
    flex-direction: column;
    align-self: center;
    border: 0px solid none;
  }

  .game-row {
    display: flex;
  }

  .game-square {
    width: 24px;
    height: 24px;
    background: var(--custom-bg);
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      background: rgba(150, 150, 255, 0.5);
    }
  }
  .ticked {
    &.unlocked {
      border: 1px solid red;
    }
    &:hover {
      background: rgba(150, 150, 255, 0.5);
    }
    &::after {
      content: attr(data-marker);
      justify-self: center;
      align-self: center;
      background: attr(data-background-color);
    }
  }
</style>

<div
  class="game-square"
  id={id}
  on:click={moveNotification}
  data-ticked={ticked}
  data-marker="X"
  style={customBg} />
