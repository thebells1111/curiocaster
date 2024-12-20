import { remoteServer } from "$/stores";

export default async function boostSats(keysend) {
  try {
    console.log(keysend);
    console.log("boost");
    let keysendData = [].concat(keysend);
    keysendData = keysendData.map((v, i, a) => {
      const recepient = v.recepient || undefined;
      const splitAmount = v.splitAmount;
      let data;
      if (recepient && splitAmount) {
        data = {
          destination: recepient.address,
          amount: splitAmount,
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
    let response = await fetch(remoteServer + "api/alby/boost", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(keysendData),
    });

    let res = await response.json();

    // let res = {
    //   success: true,
    //   message: "Success",
    //   data: {
    //     txid: "d5e2c3c8f2",
    //   },
    // // };
    // console.log(res);
    return res;
  } catch {
    (err) => console.log(err);
  }
}
