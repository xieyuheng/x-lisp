import * as B from "../basic/index.ts"
import * as R from "./index.ts"

export function encodeInt(x: bigint): bigint {
  return BigInt(x << 3n)
}

export function encodeValue(value: B.Value): bigint {
  switch (value.kind) {
    case "Int": {
      return BigInt(value.content << 3n)
    }

    case "Float": {
      return BigInt(value.content << 3) | R.FloatTag
    }

    case "Hashtag": {
      const bytes = new TextEncoder().encode(value.content)
      if (bytes.length > 6) {
        let message = `[encodeValue] can not handle long hashtag`
        message += `\n  value: ${B.formatValue(value)}`
        throw new Error(message)
      }

      const b0 = bytes[0] || 0n
      const b1 = bytes[1] || 0n
      const b2 = bytes[2] || 0n
      const b3 = bytes[3] || 0n
      const b4 = bytes[4] || 0n
      const b5 = bytes[5] || 0n

      return (
        (BigInt("#".charCodeAt(0)) << BigInt(7 * 8)) |
        (BigInt(b0) << BigInt(6 * 8)) |
        (BigInt(b1) << BigInt(5 * 8)) |
        (BigInt(b2) << BigInt(4 * 8)) |
        (BigInt(b3) << BigInt(3 * 8)) |
        (BigInt(b4) << BigInt(2 * 8)) |
        (BigInt(b5) << BigInt(1 * 8)) |
        R.LittleTag
      )
    }

    default: {
      let message = `[encodeValue] can not handle value kind`
      message += `\n  value: ${B.formatValue(value)}`
      throw new Error(message)
    }
  }
}
