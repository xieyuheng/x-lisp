import { formatDefinition, formatExp, formatMod } from "../format/index.ts"
import { prettyByFormat } from "./prettyByFormat.ts"

export const prettyExp = prettyByFormat(formatExp)
export const prettyDefinition = prettyByFormat(formatDefinition)
export const prettyMod = prettyByFormat(formatMod)
