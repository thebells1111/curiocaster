import { btcPrice } from '$/stores';

import { get } from 'svelte/store';

export default function satsToDollars(satAmount) {
	let dollars = get(btcPrice) * 10000;
	let amount = Math.round((satAmount / dollars) * 100) / 100;
	amount = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	return amount;
}
