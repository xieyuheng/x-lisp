type CompilerOptions = Record<string, string>

const knownCompilerOptions: Record<string, string[]> = {
  dump: ["true", "false"],
  basic: ["true", "false"],
  profile: ["true", "false"],
  builtin: ["true", "false"],
}

function validateCompilerOptions(options: CompilerOptions): void {
  for (const [key, value] of Object.entries(options)) {
    const allowed = knownCompilerOptions[key]
    if (allowed === undefined) {
      throw new Error(`Unknown compiler option: "${key}"`)
    }
    if (!allowed.includes(value)) {
      throw new Error(
        `Invalid value for compiler option "${key}": "${value}" (allowed: ${allowed.join(", ")})`,
      )
    }
  }
}

export { validateCompilerOptions }
export type { CompilerOptions }
