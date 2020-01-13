<script>
import Controls from './Controls.svelte'
  export let message;
</script>

<style>
  h2 {
		font-size: 2rem;
		text-align: center;
	}
</style>

<h2>{message}</h2>
<Controls /> 