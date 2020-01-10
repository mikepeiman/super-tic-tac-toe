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
margin: 0;
padding: 0;
}

	main {
		position: relative;
		/* max-width: 56em; */
		background-color: #1a1a1a;
		/* padding: 2em; */
		margin: 0 auto;
		box-sizing: border-box;
    display: flex;
    flex-direction: column;
    min-height: 90vh;
	}
</style>

<Nav {segment}/>

<main id="layout-main">
	<slot></slot>
</main>