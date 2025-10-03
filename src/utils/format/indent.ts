type Options = {
  leftMargin: string
}

export function indent(text: string, options: Options): string {
  return text
    .split("\n")
    .map((line) => options.leftMargin + line)
    .join("\n")
}
