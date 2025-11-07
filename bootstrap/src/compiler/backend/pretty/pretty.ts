import { formatDefinition, formatMod } from "../format/index.ts"
import { prettyByFormat } from "./prettyByFormat.ts"

export const prettyDefinition = prettyByFormat(formatDefinition)
export const prettyMod = prettyByFormat(formatMod)
