import { parse } from "@markwhen/parser";
import { Cache } from "@markwhen/parser/lib/Cache";

addEventListener("message", (message) => {
  postMessage(parse(message.data.rawTimelineString));
});

export {};
