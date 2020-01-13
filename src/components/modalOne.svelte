<script>
  import { getContext } from 'svelte';
  import modalOneContent from './modalOneContent.svelte';

  const { open } = getContext('simple-modal');

  const showModalOneContent = () => {
		open(modalOneContent, { message: "Game Controls:" });
	};
</script>

<p>
	<button on:click={showModalOneContent}>Game Menu</button>
</p>