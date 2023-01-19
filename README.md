# [Markwhen](https://markwhen.com)

Markwhen is a text-to-timeline tool. You write markdown-ish text and it gets converted into a nice looking cascading timeline.

Use the editor [here](https://markwhen.com).

This repo is for the _renderer_, not the editor. The editor (markwhen.com) and [VSCode extension](https://marketplace.visualstudio.com/items?itemName=Markwhen.markwhen) are built on top of the renderer.

| Links            |                                                                                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Parser           | [https://github.com/mark-when/parser](https://github.com/mark-when/parser)                                                                     |
| Editor           | [https://markwhen.com](https://markwhen.com)                                                                                                   |
| Documentation    | [https://docs.markwhen.com](https://docs.markwhen.com)                                                                                         |
| Blog             | [https://blog.markwhen.com](https://blog.markwhen.com)                                                                                         |
| VSCode extension | [https://marketplace.visualstudio.com/items?itemName=Markwhen.markwhen](https://marketplace.visualstudio.com/items?itemName=Markwhen.markwhen) |

<br>

## Get updated

If you'd like to be kept up-to-date about markwhen's feature development, add your email [here](https://docs.google.com/forms/d/e/1FAIpQLSceSLgm90NljlcMvdU2Ly45JYB7ZWGN1BNzQg-T-NSWO1Hm-w/viewform?usp=sf_link).

<br>

## VSCode Extension

Get the VSCode extension [here](https://marketplace.visualstudio.com/items?itemName=Markwhen.markwhen).

To switch between the text editor and the timeline view, select `View: Reopen editor with...` from the command palette and choose `Text Editor`.

<br>

## Quick start

```
> git clone git@github.com:mark-when/markwhen.git
> cd markwhen
> npm i
> npm run dev
```

The renderer renders whatever is given to the [`markwhenStore`](src/Markwhen/markwhenStore.ts).

To enable editing from the timeline view, set [`editorOrchestrator.editable`](src/EditorOrchestrator/editorOrchestratorStore.ts) to `true`:

```
const editable = ref(true);
```
