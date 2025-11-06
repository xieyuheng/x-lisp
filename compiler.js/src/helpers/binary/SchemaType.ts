export type SchemaType = IntSchemaType | UintSchemaType | FloatSchemaType

type IntSchemaType = "Int8" | "Int16" | "Int32" | "BigInt64"
type UintSchemaType = "Uint8" | "Uint16" | "Uint32" | "BigUint64"
type FloatSchemaType = "Float16" | "Float32" | "Float64"
