import { parser } from "./cascade"
import { LRLanguage, LanguageSupport } from "@codemirror/language"
import { styleTags, tags as t } from "@codemirror/highlight"

export const cascadeLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      styleTags({
        TagColor: t.variableName,
        Comment: t.lineComment,
      })
    ]
  }),
  languageData: {
    commentTokens: { line: "//" }
  }
})

export function cascade() {
  return new LanguageSupport(cascadeLanguage)
}