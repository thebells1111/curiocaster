import { remoteServer, satBalance, lastAlbyRefreshTime } from "$/stores";
import { get } from "svelte/store";

// Refresh token if it's older than 10 minutes (600000 ms)
const REFRESH_THRESHOLD = 600000;

/**
 * Refreshes the Alby token and balance if needed
 * @returns {Promise<boolean>} True if refresh was successful or not needed, false otherwise
 */
export default async function refreshAlbyToken() {
  const currentTime = Date.now();
  const lastRefreshTime = get(lastAlbyRefreshTime);

  // Only refresh if more than REFRESH_THRESHOLD time has passed since last refresh
  if (currentTime - lastRefreshTime < REFRESH_THRESHOLD) {
    console.log("Skipping Alby refresh - token is still fresh");
    return true;
  }

  console.log("Refreshing Alby token and balance");
  try {
    const response = await fetch(remoteServer + "api/alby/refresh", {
      credentials: "include",
    });

    const data = await response.text();
    try {
      const user = JSON.parse(data);
      if (user.balance !== undefined) {
        satBalance.set(user.balance);
        lastAlbyRefreshTime.set(currentTime);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error parsing Alby refresh response:", error);
      return false;
    }
  } catch (error) {
    console.error("Error refreshing Alby token:", error);
    return false;
  }
}