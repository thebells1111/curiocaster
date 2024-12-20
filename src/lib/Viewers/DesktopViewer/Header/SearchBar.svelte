<script>
	import Search from '$lib/icons/Search.svelte';
</script>

<button
	aria-label="Search"
	on:click={() => {
		history.pushState({}, null, 'search');
		window.dispatchEvent(new Event('popstate'));
	}}
>
	<Search size="27px" />
</button>

<style>
	button {
		background-color: transparent;
		margin: 0.5em 0.25em 0.25em.25em;
		padding: 0;
		border: none;
		color: #aaa;
	}
	button:hover {
		color: transparent;
		border: none;
		color: #ccc;
	}

	button:active {
		background-color: transparent;
		border: none;
		color: #aaa;
	}
</style>
