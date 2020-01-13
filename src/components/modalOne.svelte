<script>
  import { getContext } from 'svelte';
  import modalOneContent from './modalOneContent.svelte';

  const { open } = getContext('simple-modal');

  const showModalOneContent = () => {
		open(modalOneContent, { message: "It's a modal!" });
	};
</script>

<p>
	<button on:click={showModalOneContent}>Show me a modalOneContent!</button>
</p>