<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

html,
body {
width: 100%;
height: 100%;
}

	main {
		position: relative;
		/* max-width: 56em; */
		background-color: white;
		/* padding: 2em; */
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>

<Nav {segment}/>

<main>
	<slot></slot>
</main>