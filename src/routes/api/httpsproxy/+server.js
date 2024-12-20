import { text } from "@sveltejs/kit";

export async function GET({ url }) {
  const q = url.searchParams.get("url");
  let res = await fetch(q);
  let feed = await res.text();
  return text(feed);
}
