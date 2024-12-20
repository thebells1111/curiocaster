<script>
	import { devMode } from '$/stores';
</script>

{#if devMode}
	<a
		href="https://getalby.com/oauth?client_id=32dVOIuGiA&response_type=code&redirect_uri=http://localhost:3000&scope=account:read%20balance:read%20payments:send%20invoices:create%20transactions:read"
		target="_self"
		style="color:transparent"
	>
		Go Here
	</a>
{:else}
	<a
		href="https://getalby.com/oauth?client_id=CAVpd6denC&response_type=code&redirect_uri=https://curiocaster.com&scope=account:read%20balance:read%20payments:send%20invoices:create%20transactions:read"
		target="_self"
		style="color:transparent"
	>
		Go Here
	</a>
{/if}

<style>
	a {
		margin-left: 40px;
	}
</style>
