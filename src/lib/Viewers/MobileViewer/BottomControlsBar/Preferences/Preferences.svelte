<script>
	import { showPreferences } from '$/stores';

	function handlePreferences() {
		$showPreferences = true;
	}
</script>

<div on:click={handlePreferences}>Preferences</div>

<style>
	div {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		flex-grow: 0;
	}

	div:hover {
		background-color: #333;
		color: #eee;
	}
</style>
