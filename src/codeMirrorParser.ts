import { parser } from "./cascade";
import { LRLanguage, LanguageSupport } from "@codemirror/language";
import { styleTags, tags as t } from "@codemirror/highlight";

export const cascadeLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      styleTags({
        "DateRange Date ISO8601 RelativeDate SlashDate Digits MeasureWord": t.keyword,
      }),
    ],
  }),
  languageData: {
    commentTokens: { line: "//" },
  },
});

export function cascade() {
  return new LanguageSupport(cascadeLanguage);
}
