import { btcPrice } from '$/stores';

import { get } from 'svelte/store';

export default function dollarsToSats(dollarAmount) {
	let satsPerDollar = get(btcPrice) * 10000;
	let amount = Math.trunc(Math.round(satsPerDollar * dollarAmount * 100) / 100);
	return amount || 0;
}
