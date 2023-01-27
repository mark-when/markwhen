import { usePageEffect } from "@/Markwhen/composables/usePageEffect";
import { useMarkwhenStore } from "@/Markwhen/markwhenStore";
import { defineStore } from "pinia";
import { walk } from "@/Views/Timeline/useNodeStore";
import { isEventNode } from "@markwhen/parser/lib/Noder";
import type { Path } from "@markwhen/parser/lib/Types";
import { useTransformStore } from "@/Markwhen/transformStore";

export const useCollapseStore = defineStore("collapse", () => {
  const markwhenStore = useMarkwhenStore();
  const transformStore = useTransformStore();

  const collapsed = usePageEffect((index) => {
    const mw = markwhenStore.timelines[index];
    const set = new Set<string>();
    if (mw) {
      walk(mw.events, [], (node, path) => {
        if (!isEventNode(node)) {
          if (!node.startExpanded) {
            set.add(path.join(","));
          }
        }
      });
    }
    return set;
  });

  const collapse = (path: Path) => {
    collapsed.value.add(path.join(","));
  };
  const expand = (path: Path) => {
    collapsed.value.delete(path.join(","));
  };
  const toggleCollapsed = (path: Path) => {
    const pathJoined = path.join(",");
    if (collapsed.value.has(pathJoined)) {
      collapsed.value.delete(pathJoined);
    } else {
      collapsed.value.add(pathJoined);
    }
  };
  const setCollapsed = (path: Path | string, shouldCollapse: boolean) => {
    const pathJoined = typeof path === "string" ? path : path.join(",");
    if (shouldCollapse) {
      collapsed.value.add(pathJoined);
    } else {
      collapsed.value.delete(pathJoined);
    }
  };
  const isCollapsed = (path: Path | string) => {
    const pathJoined = typeof path === "string" ? path : path.join(",");
    for (const entry of collapsed.value.keys()) {
      if (pathJoined === entry) {
        return true;
      }
    }
    return false;
  };
  const isCollapsedChild = (path: Path | string) => {
    const pathJoined = typeof path === "string" ? path : path.join(",");
    const pathAsArray =
      typeof path === "string" ? path.split(",").map((i) => parseInt(i)) : path;
    for (const entry of collapsed.value.keys()) {
      if (pathJoined !== entry && pathJoined.startsWith(`${entry},`)) {
        return true;
      }
    }
    return false;
  };
  const isCollapsedChildOf = (path: Path | string) => {
    const pathJoined = typeof path === "string" ? path : path.join(",");

    // We're looking for the shallowest ancestor of this node that has collapsed it
    let highest: string | undefined;

    for (const entry of collapsed.value.keys()) {
      if (pathJoined !== entry && pathJoined.startsWith(`${entry},`)) {
        if (!highest || entry.length < highest.length) {
          highest = entry;
        }
      }
    }

    return highest?.split(",").map((i) => parseInt(i));
  };

  const collapseAll = () => {
    walk(transformStore.transformedEvents, [], (node, path) => {
      if (!isEventNode(node)) {
        setCollapsed(path, true);
      }
    });
  };

  const expandAll = () => {
    walk(transformStore.transformedEvents, [], (node, path) => {
      if (!isEventNode(node)) {
        setCollapsed(path, false);
      }
    });
  };

  return {
    collapsed,
    isCollapsed,
    isCollapsedChild,
    isCollapsedChildOf,
    collapse,
    setCollapsed,
    toggleCollapsed,
    expand,
    collapseAll,
    expandAll,
  };
});
