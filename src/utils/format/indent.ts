import { stringIsBlank } from "../string/stringIsBlank.ts"

type Options = {
  length: number
}

export function indent(text: string, options: Options): string {
  return text
    .split("\n")
    .map((line) => {
      if (stringIsBlank(line)) return line
      else return " ".repeat(options.length) + line
    })
    .join("\n")
}
