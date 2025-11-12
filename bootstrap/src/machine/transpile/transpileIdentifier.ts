export function transpileIdentifier(identifier: string): string {
  return identifier.split("").map(transpileChar).join("")
}

function transpileChar(char: string): string {
  switch (char) {
    case "-":
      return "_"
    case "/":
      return "."
    default:
      return char
  }
}
