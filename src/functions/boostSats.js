import { remoteServer, playingSplitbox } from "$/stores";
import { get } from "svelte/store";

export default async function boostSats(keysend) {
  try {
    console.log(keysend);
    let res;
    const $playingSplitbox = get(playingSplitbox);
    console.log($playingSplitbox);

    if ($playingSplitbox) {
      let tlv = keysend?.[0]?.record?.[7629169];
      delete tlv.value_msat;
      let invoiceRoute = $playingSplitbox["@_invoice"];

      let webhookRoute = $playingSplitbox["@_webhook"];
      let payload = { type: "bitcoin-lightning", metadata: tlv };
      let invoice = await getInvoice(payload, invoiceRoute);
      console.log(invoice);
      let payment = await sendSats(invoice);
      console.log(payment);
      let completedPayments = await handlePaid(payment?.info, webhookRoute);
      console.log(completedPayments);

      res = completedPayments;
    } else {
      let keysendData = [].concat(keysend);
      keysendData = keysendData.map((v, i, a) => {
        const recepient = v.recepient || undefined;
        const splitAmount = v.splitAmount;
        let data;
        if (recepient && splitAmount) {
          data = {
            destination: recepient.address,
            amount: splitAmount,
            type: recepient.type,
          };
          data.customRecords = {};
          if (recepient.customKey && recepient.customValue) {
            data.customRecords[recepient.customKey] = recepient.customValue;
          }

          //this is to convert the record value into a string instead of object, but keep the customKey
          let record = v.record;
          let recordStringified = {};
          const key = Object.keys(record)[0];
          recordStringified[key] = JSON.stringify(record[key]);

          if (record) {
            data.customRecords = {
              ...data.customRecords,
              ...recordStringified,
            };
          }
        }
        return data;
      });
      let response = await fetch(remoteServer + "api/alby/handlePayments", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(keysendData),
      });

      let res = await response.json();

      // res = {
      //   success: true,
      //   message: "Success",
      //   data: {
      //     txid: "d5e2c3c8f2",
      //   },
      // };
      // console.log(res);
    }
    return res;
  } catch {
    (err) => {
      console.log(err);
      return { err };
    };
  }
}

async function getInvoice(payload, route) {
  try {
    let res = await fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const invoice = await res.json();
    return invoice;
  } catch (error) {
    console.log(error);
  }
}

async function sendSats(invoice) {
  try {
    const res = await fetch(`${remoteServer}api/alby/pay-invoice`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoice),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

async function handlePaid(paymentInfo, route) {
  let res = await fetch(route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentInfo),
  });

  let data = await res.json();
  return data;
}
