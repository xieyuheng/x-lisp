import { formatDefinition, formatMod } from "../format/index.ts"
import { prettySexpByFormat } from "./prettySexpByFormat.ts"

export const prettyDefinition = prettySexpByFormat(formatDefinition)
export const prettyMod = prettySexpByFormat(formatMod)
