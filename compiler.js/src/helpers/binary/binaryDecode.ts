import { createBinaryContext, type BinaryContext } from "./BinaryContext.ts"
import type { BinarySchema } from "./BinarySchema.ts"
import type { SchemaType } from "./SchemaType.ts"

export function binaryDecode(buffer: ArrayBuffer, schema: BinarySchema): any {
  const context = createBinaryContext(buffer, {})
  execute(context, schema)
  return context.data
}

function execute(context: BinaryContext, schema: BinarySchema): null {
  switch (schema.kind) {
    case "SequenceSchema": {
      for (const childSchema of schema.schemas) {
        execute(context, childSchema)
      }

      return null
    }

    case "AttributeSchema": {
      executeAttribute(context, schema.name, schema.type)
      return null
    }

    case "DependentSchema": {
      execute(context, schema.fn(context.data))
      return null
    }
  }
}

function executeAttribute(
  context: BinaryContext,
  name: string,
  type: SchemaType,
): null {
  switch (type) {
    case "Int8": {
      context.data[name] = context.view.getInt8(context.index)
      context.index += 1
      return null
    }

    case "Int16": {
      context.data[name] = context.view.getInt16(context.index, true)
      context.index += 2
      return null
    }

    case "Int32": {
      context.data[name] = context.view.getInt32(context.index, true)
      context.index += 4
      return null
    }

    case "BigInt64": {
      context.data[name] = context.view.getBigInt64(context.index, true)
      context.index += 8
      return null
    }

    case "Uint8": {
      context.data[name] = context.view.getUint8(context.index)
      context.index += 1
      return null
    }

    case "Uint16": {
      context.data[name] = context.view.getUint16(context.index, true)
      context.index += 2
      return null
    }

    case "Uint32": {
      context.data[name] = context.view.getUint32(context.index, true)
      context.index += 4
      return null
    }

    case "BigUint64": {
      context.data[name] = context.view.getBigUint64(context.index, true)
      context.index += 8
      return null
    }

    case "Float16": {
      context.data[name] = context.view.getFloat16(context.index, true)
      context.index += 2
      return null
    }

    case "Float32": {
      context.data[name] = context.view.getFloat32(context.index, true)
      context.index += 4
      return null
    }

    case "Float64": {
      context.data[name] = context.view.getFloat64(context.index, true)
      context.index += 8
      return null
    }
  }
}
