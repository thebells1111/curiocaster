import clone from "just-clone";
import { walletValueBlock, walletDisabled } from "$/stores";

import { get } from "svelte/store";

export default function getWalletValueBlock(
  episode,
  podcast,
  timeSplit,
  feedGuid,
  itemGuid
) {
  walletValueBlock.set(undefined);

  let valueBlock =
    timeSplit && Object.keys(timeSplit).length === 0
      ? null
      : timeSplit || episode?.value || podcast?.value;
  let walletBlock = !get(walletDisabled) && valueBlock;

  if (walletBlock) {
    let destinations = valueBlock.destinations;

    walletBlock.destinations = normalizeDestinations([].concat(destinations));
    walletBlock.feedGuid = feedGuid;
    walletBlock.itemGuid = itemGuid;

    walletValueBlock.set(walletBlock);
  }
}

function normalizeDestinations(data) {
  console.log(clone(data));
  const nonFeeItems = data.filter((item) => !item.fee);
  const feeItems = data.filter((item) => item.fee);

  // Calculate total split of non-fee items
  const totalSplit = nonFeeItems.reduce(
    (acc, item) => acc + Number(item.split),
    0
  );

  // Normalize splits to percentages of the total
  nonFeeItems.forEach(
    (item) => (item.split = (Number(item.split) / totalSplit) * 100)
  );

  // Merge fee and non-fee items
  const normalizedData = nonFeeItems.concat(feeItems);

  return normalizedData;
}
