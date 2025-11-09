export class Console {
  outputs: Array<string> = []

  write(text: string): void {
    this.outputs.push(text)
  }

  consumeOutput(): string {
    const output = this.outputs.join("")
    this.outputs = []
    return output
  }
}

export const console = new Console()
