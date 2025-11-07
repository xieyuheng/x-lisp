import {
  type Context,
  contextCurrentFrame,
  contextIsFinished,
} from "./Context.ts"
import { execute } from "./execute.ts"
import { frameNextInstr } from "./Frame.ts"

export function executeOneStep(context: Context): void {
  if (contextIsFinished(context)) return

  const frame = contextCurrentFrame(context)
  const instr = frameNextInstr(frame)
  execute(context, frame, instr)
}
