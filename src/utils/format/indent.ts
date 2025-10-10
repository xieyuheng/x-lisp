type Options = {
  length: number
}

export function indent(text: string, options: Options): string {
  return text.split("\n").join("\n" + " ".repeat(options.length))
}
