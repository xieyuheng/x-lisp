export function indent(length: number, text: string): string {
  return text.split("\n").join("\n" + " ".repeat(length))
}
