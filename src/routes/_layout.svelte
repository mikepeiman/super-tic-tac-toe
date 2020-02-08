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
font-size: 100%;
}

	main {
		position: relative;
		width: 100%;
		/* background-color: #1a1a1a; */
		/* padding: 2em; */
		margin: 0 auto;
		box-sizing: border-box;
    display: flex;
    flex-direction: column;
    min-height: 100vh;

	}

    @media screen and (min-width: 600px) {
    body {
      font-size: 60%;
    }
  }
  @media screen and (min-width: 900px) {
    body {
      font-size: 80%;
    }
  }

  @media screen and (min-width: 1200px) {
    body {
      font-size: 100%;
    }
  }

  @media screen and (min-width: 1200px) {
    body {
      font-size: 120%;
    }
  }
</style>

<!-- <Nav {segment}/> -->

<main id="layout-main">
	<slot></slot>
</main>