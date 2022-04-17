import { EditorView, WidgetType } from "@codemirror/view";

export class ColorPickerWidget extends WidgetType {
  constructor(readonly color: string, readonly tag: string) {
    super();
  }

  eq(colorPicker: ColorPickerWidget): boolean {
    return colorPicker.color === this.color && colorPicker.tag === this.tag;
  }

  toDOM(_: EditorView): HTMLElement {
    const wrap = document.createElement("span");
    wrap.setAttribute("aria-hidden", "true");
    wrap.className = "cm-colorPickerWrapper";
    const colorInput = wrap.appendChild(document.createElement("input"));
    colorInput.className = "cm-colorPicker";
    colorInput.type = "color";
    colorInput.value = this.color
    // colorInput.style.marginRight = "2px";
    // colorInput.style.height = "0.6rem";
    // colorInput.style.width = "0.6rem";
    return wrap;
  }

  ignoreEvent(_: Event): boolean {
    return false;
  }
}
