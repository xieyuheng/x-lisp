import { type Mod } from "../mod/index.ts"

// We use `provide` only because `export` is used in JS as keyword.

export function provide(mod: Mod, names: Array<string>): void {
  for (const name of names) {
    mod.exported.add(name)
  }
}
