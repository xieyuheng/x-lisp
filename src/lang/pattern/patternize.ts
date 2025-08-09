import type { Env } from "../env/index.ts"
import type { Exp } from "../exp/index.ts"
import type { Mod } from "../mod/index.ts"
import type { Pattern } from "./Pattern.ts"

type Effect = (mod: Mod, env: Env) => Pattern

export function patternize(exp: Exp): Effect {
  throw new Error("TODO patternize")
}
