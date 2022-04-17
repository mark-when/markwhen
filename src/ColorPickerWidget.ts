import { EditorView, WidgetType } from "@codemirror/view";

export class ColorPickerWidget extends WidgetType {
  constructor(readonly color: string) {
    super();
  }

  eq(colorPicker: ColorPickerWidget): boolean {
    return colorPicker.color === this.color;
  }

  toDOM(_: EditorView): HTMLElement {
    const wrap = document.createElement("span");
    wrap.setAttribute("aria-hidden", "true");
    wrap.className = "cm-colorPickerWrapper";
    const box = wrap.appendChild(document.createElement("button"));
    box.className = "cm-colorPicker";
    box.style.backgroundColor = `rgba(${this.color}, 0.9)`;
    box.style.display = "inline-block";
    box.style.marginRight = "2px";
    box.style.height = "0.6rem";
    box.style.width = "0.6rem";
    return wrap;
  }

  ignoreEvent(_: Event): boolean {
    return false;
  }
}
