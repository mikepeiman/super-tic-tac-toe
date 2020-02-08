<script>
import Controls from './Controls.svelte'
  export let message;
</script>

<style>
  .modal-title {
		font-size: 2rem;
    text-align: center;
    color: white;
	}
</style>

<h2 class="modal-title">{message}</h2>
<Controls /> 