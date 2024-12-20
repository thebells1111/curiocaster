<script>
	import { walletId } from '$/stores';
</script>

<h2>Wallet Info</h2>

<h3>Lightning Network Address:</h3>
<p>02a128c92baf0ede00ed0fc3720a92ba2c6392e0b58aa4decab1d787a666d94cb7</p>

<h3>Custom Key:</h3>
<p>112111100</p>

<h3>Custom Value:</h3>
<p>{$walletId}</p>

<p class="explanation">
	Your CurioCaster wallet can receive sats via your podcast by entering this data into the
	podcast:value block of your RSS feed. Contact your podcast hosting provider to find out how you
	can add value to your feed.
</p>

<style>
	h2 {
		text-align: center;
		margin-top: 0;
	}
	h3 {
		margin: 0;
		color: var(--accent-color-blue);
	}

	p {
		word-wrap: break-word;
	}

	.explanation {
		padding: 0;
		margin-top: 32px;
	}
</style>
