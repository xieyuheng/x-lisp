import { formatMod } from "../format/index.ts"
import { sexpConfig } from "./sexpConfig.ts"
import * as S from "@xieyuheng/sexp.js"

export const prettyMod = S.prettySexpByFormat(formatMod, sexpConfig)
