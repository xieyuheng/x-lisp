import * as S from "@xieyuheng/sexp.js"
import { formatMod } from "../format/index.ts"
import { sexpConfig } from "./sexpConfig.ts"

export const prettyMod = S.prettySexpByFormat(formatMod, sexpConfig)
