<script>
  import boostSats from "$functions/boostSats";
  import dollarsToSats from "$functions/dollarsToSats";
  import getBaseRecord from "$functions/getBaseRecord";

  import {
    playingPodcast,
    walletDB,
    playerIsPaused,
    walletValueBlock,
    defaultStream,
    streamingInterval,
    satBalance,
    streamingEnabled,
    playingStream,
    showFiat,
    anonStream,
    nickName,
  } from "$/stores";

  let runningTime = 0;
  let lastTime = new Date().getTime();

  let runningAmounts = {};
  let oldInterval;
  let runningInterval;
  //two intervals are needed because of how setInterval keeps track of intervals

  $: if ($walletValueBlock) {
    handleNewValueBlock();
  }
  async function handleNewValueBlock() {
    if ($walletValueBlock) {
      runningTime = 0;
      runningAmounts = await buildRunningAmounts();
    } else {
      runningAmounts = {};
    }
  }

  function getId(d) {
    let id = d.address;
    if (d.name) {
      id = id + d.name;
    }
    if (d.customKey) {
      id = id + d.customKey;
    }
    if (d.customValue) {
      id = id + d.customValue;
    }
    if (d.fee) {
      id = id + "fee";
    }

    return id;
  }

  function increaseRunningTime() {
    runningTime += new Date().getTime() - lastTime;
    lastTime = new Date().getTime();

    let satValue = $showFiat
      ? dollarsToSats($playingStream ?? $defaultStream)
      : ($playingStream ?? $defaultStream);

    satValue = Number(satValue) || 0;

    if ($satBalance > satValue * 1.1 && satValue - runningAmounts.fee > 0) {
      for (const d of $walletValueBlock.destinations) {
        let id = getId(d);
        if (d.fee) {
          //takes streaming amount times split percent per sec times 90% (for fees)
          runningAmounts[id].value += ((satValue * (d.split / 100)) / 60) * 0.9;
        } else {
          runningAmounts[id].value +=
            (((satValue - runningAmounts.fee) * (d.split / 100)) / 60) * 0.9;
        }
        walletDB.setItem(id, runningAmounts[id]);
      }

      if (runningTime >= $streamingInterval) {
        runningTime = 0;
        $satBalance -= satValue;
        processPayment();
      }
    } else {
      if (runningTime >= $streamingInterval) {
        runningTime = 0;
        $streamingEnabled = false;
        console.log("not streaming, streaming amount too low");
      }
    }
  }

  async function processPayment() {
    console.log(`still streaming for ${$playingPodcast.title}`);
    let payments = [];
    for (const id in runningAmounts) {
      let dest = runningAmounts[id];

      if (dest.value > 5 && dest.value < $satBalance) {
        let amount = Math.floor(dest.value);
        try {
          let record = getBaseRecord({ action: "stream", amount });
          if (!$anonStream) {
            record[7629169].sender_name = $nickName;
          }

          record[7629169].value_msat = amount * 1000;
          record[7629169].name = dest.name;

          payments.push({
            recepient: dest,
            splitAmount: amount,
            record: record,
          });

          dest.value -= amount;
          walletDB.setItem(id, dest);
        } catch {
          (err) => console.log(err);
        }
      }
    }
    if (payments.length) {
      boostSats(payments).then((data) => {});
      payments = [];
    }
  }

  $: showValueBlockLog($walletValueBlock);

  function showValueBlockLog() {
    console.log(" ");
    console.log(
      `${$playingPodcast.title} Value Block: `,
      $walletValueBlock ? $walletValueBlock.destinations : "none"
    );
  }

  async function buildRunningAmounts() {
    let temp = { fee: 0 };
    for (const d of $walletValueBlock.destinations) {
      let id = getId(d);
      if (d.fee) {
        temp.fee += Number(d.split);
      }
      let walletItem = await getWalletItem(id);
      if (walletItem) {
        temp[id] = walletItem;
        temp[id].name = d.name; //this was added later and may not be in every saved instance of walletItem
      } else {
        temp[id] = {
          value: 0,
          name: d.name,
          address: d.address,
          customKey: d.customKey,
          customValue: d.customValue,
          fee: d.fee,
        };
      }
    }
    return temp;
  }

  async function getWalletItem(id) {
    if (walletDB) {
      return await walletDB.getItem(id);
    }
  }

  $: if (!$playerIsPaused && $walletValueBlock) {
    setTimeout(() => console.log("streaming started"), 300);
    lastTime = new Date().getTime();
    runningInterval = setInterval(increaseRunningTime, 1000);
    if (oldInterval !== runningInterval) {
      clearInterval(oldInterval);
      oldInterval = runningInterval;
    }
  } else {
    clearInterval(runningInterval);
    console.log("streaming stopped");
  }
</script>
