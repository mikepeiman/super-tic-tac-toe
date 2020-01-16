<script>
  import { getContext } from 'svelte';
  import modalOneContent from './modalOneContent.svelte';

  const { open } = getContext('simple-modal');
  let styling = {
    window: {
      background: 'none',
      padding: '5rem'
    },
    close: {
      width: '3rem',
      height: '3rem'
    },
    content: {
      padding: '2rem',
      borderRadius: '5px',
      background: '#1a1a1a'
    }
  }
  const showModalOneContent = () => {
		open(modalOneContent, { message: "Game Controls:" }, styling);
	};
</script>

<style lang="scss">

:global(.window button.close) {
  width: 3rem;
  height: 3rem;
  &:before {
    left: .5rem;
    width: 2rem;
  }
  &:after {
    left: .5rem;
    width: 2rem;
  }
}
</style>

	<button class="control-button" id="game-menu-button" on:click={showModalOneContent}>Game Menu</button>
