import type {
  DateFormat,
  DateRangeIso,
  DateTimeGranularity,
} from "@markwhen/parser/lib/Types";
import type { Ref } from "vue";
import type { DisplayScale } from "../Timeline/utilities/dateTimeUtilities";
import type { EventPath, State } from "./useStateSerializer";

interface MessageTypes {
  state: State;
  setHoveringPath: EventPath;
  setDetailPath: EventPath;
  key: string;
  showInEditor: EventPath;
  newEvent: {
    dateRangeIso: DateRangeIso;
    granularity?: DateTimeGranularity;
    immediate: boolean;
  };
  editEventDateRange: {
    path: EventPath;
    range: DateRangeIso;
    scale: DisplayScale;
    preferredInterpolationFormat: DateFormat | undefined;
  };
  jumpToPath: {
    path: EventPath;
  };
  jumpToRange: {
    dateRangeIso: DateRangeIso;
  };
}

interface TimelineSpecificMessages {
  toggleMiniMap: void;
  toggleNowLine: void;
  zoom: {
    level: number;
  };
  autoCenter: void;
}

type MessageType = keyof MessageTypes;
type MessageParam<T extends keyof MessageTypes> = MessageTypes[T];

export interface Message<T extends MessageType> {
  type: T;
  request?: boolean;
  response?: boolean;
  id: string;
  params?: MessageParam<T>;
}

type MessageListeners = {
  [Property in keyof MessageTypes]?: (event: MessageTypes[Property]) => any;
};
export const getNonce = () => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export const useLpc = (
  frame: Ref<HTMLIFrameElement | undefined>,
  listeners: MessageListeners
) => {
  const calls: Map<
    string,
    {
      resolve: (a: any) => void;
      reject: (a: any) => void;
    }
  > = new Map();

  const post = <T extends MessageType>(
    message: Message<T>,
    origin: string = "*"
  ) =>
    frame.value?.contentWindow?.postMessage(message, { targetOrigin: origin });

  const postRequest = <T extends MessageType>(
    type: T,
    params?: MessageParam<T>
  ) => {
    const id = `markwhen_${getNonce()}`;
    return new Promise((resolve, reject) => {
      calls.set(id, { resolve, reject });
      post({
        type,
        request: true,
        id,
        params,
      });
    });
  };

  const postResponse = <T extends MessageType>(
    id: string,
    type: T,
    params?: MessageParam<T>
  ) => post<T>({ type, response: true, id, params });

  window.addEventListener(
    "message",
    <T extends keyof MessageTypes>(e: MessageEvent<Message<T>>) => {
      if (!e.data.id || !e.data.id.startsWith("markwhen")) {
        return;
      }

      const data = e.data;
      if (data.response) {
        calls.get(data.id)?.resolve(data);
        calls.delete(data.id);
      } else if (data.request) {
        const result = listeners?.[data.type]?.(data.params!);
        Promise.resolve(result).then((resp) => {
          if (typeof resp !== "undefined") {
            postResponse(data.id, data.type, resp);
          }
        });
      } else {
        console.error("Not a request or response", data);
      }
    }
  );

  return { postRequest, post };
};
