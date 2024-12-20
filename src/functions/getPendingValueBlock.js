import { walletDisabled } from "$/stores";

import { get } from "svelte/store";

export default function getPendingValueBlock(episode, podcast) {
  console.log("ep: ", episode);
  console.log("pc: ", podcast);
  let valueBlock = episode?.value || podcast?.value;
  let walletBlock = !get(walletDisabled) && valueBlock;

  if (walletBlock) {
    let destinations = valueBlock.destinations;
    walletBlock.destinations = destinations;
    return walletBlock;
  }
}
