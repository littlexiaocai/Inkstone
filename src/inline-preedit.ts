import { StateEffect, StateField, type Extension } from "@codemirror/state";
import { Decoration, EditorView, WidgetType } from "@codemirror/view";

/* 行内拼音：像微信输入法那样，把正在打的拼音画在光标处，带下划线。
   它是一个 widget 装饰，不是文档里的字——不进撤销栈、不改文件、不会被同步出去。
   位置永远跟着主光标，所以上屏、改文字之后不用手动搬。 */

export const inlinePreeditEffect = StateEffect.define<string>();

export const INLINE_PREEDIT_CLASS = "just-type-inline-preedit";

class PreeditWidget extends WidgetType {
  constructor(readonly text: string) {
    super();
  }

  eq(other: PreeditWidget): boolean {
    return other.text === this.text;
  }

  toDOM(): HTMLElement {
    return createSpan({ cls: INLINE_PREEDIT_CLASS, text: this.text });
  }

  /* 每敲一个字母文字都变。原地改字，不重建节点，免得光标闪。 */
  updateDOM(dom: HTMLElement): boolean {
    dom.textContent = this.text;
    return true;
  }

  ignoreEvent(): boolean {
    return true;
  }
}

const preeditText = StateField.define<string>({
  create: () => "",
  update(value, tr) {
    for (const effect of tr.effects) {
      if (effect.is(inlinePreeditEffect)) value = effect.value;
    }
    return value;
  }
});

/* side: -1 让拼音画在光标前面，光标停在拼音末尾，和系统输入法的组字一样。 */
const preeditDecorations = EditorView.decorations.compute([preeditText, "doc", "selection"], (state) => {
  const text = state.field(preeditText);
  if (!text) return Decoration.none;
  const widget = Decoration.widget({ widget: new PreeditWidget(text), side: -1 });
  return Decoration.set([widget.range(state.selection.main.head)]);
});

export const inlinePreeditExtension: Extension = [preeditText, preeditDecorations];
