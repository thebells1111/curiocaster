import { userState, walletSaved, loggedIn, showLogin } from "$/stores";
import getBalance from "./getBalance";
import createWallet from "./createWallet";
import { browser } from "$app/environment";

import { get } from "svelte/store";

export default async function checkStoredWallet(status) {
  let data = {
    type: "getWak",
  };
  try {
    fetch(`/api/database`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) =>
      response.json().then((data) => {
        if (data.status === "success") {
          get(userState).wallet.saved = true;
          walletSaved.set(true);
          loggedIn.set(true);
          showLogin.set(false);
          getBalance();
        } else {
          createWallet();
        }
      })
    );
  } catch {
    (error) => {
      console.error("Error:", error);
    };
  }
}
