<script>
	import Refresh from '$lib/icons/Refresh.svelte';

	function handleRefresh() {
		window.location.href = '/';
	}
</script>

<div on:click={handleRefresh}><span>Reload App</span><Refresh /></div>

<style>
	div {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	div:hover {
		background-color: #333;
		color: #eee;
	}

	span {
		margin-right: 4px;
	}
</style>
