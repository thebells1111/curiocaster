<script>
	import TransactionHistory from './TransactionHistory.svelte';

	let currentPage = 0;
	let list;
</script>

<h2>Transactions</h2>
<div class="scroll-bar-clipper" bind:this={list}>
	<TransactionHistory bind:list bind:currentPage />
</div>

<style>
	.scroll-bar-clipper {
		height: calc(100% - 40px);
		width: 100%;
		overflow: auto;
		display: flex;
		flex-direction: column;
	}

	h2 {
		text-align: center;
		margin: 0;
		min-height: 40px;
	}
</style>
