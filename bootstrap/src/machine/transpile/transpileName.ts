export function transpileName(parts: Array<string>): string {
  return parts.map(transpilePart).join(".")
}

function transpilePart(part: string): string {
  return part.split("").map(transpileChar).join("")
}

function transpileChar(char: string): string {
  switch (char) {
    case "-":
      return "_"
    case "/":
      return "."
    case "?":
      return "_p"
    case "!":
      return "_mut"
    default:
      return char
  }
}
