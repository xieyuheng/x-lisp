import {
  fixedArray,
  int32,
  magic,
  offset,
  State,
  structure,
  uint16,
  uint32,
  uint8,
} from "../codec/index.ts"
import type {
  Bmp,
  BmpFileHeader,
  BmpInfoHeader,
  ColorTableEntry,
} from "./Bmp.ts"

const bmpEndian = "LittleEndian" as const

const fileHeaderCodec = structure({
  fileSize: uint32,
  reserved: uint32,
  pixelDataOffset: uint32,
})

const infoHeaderCodec = structure({
  headerSize: uint32,
  imageWidth: int32,
  imageHeight: int32,
  colorPlanes: uint16,
  bitsPerPixel: uint16,
  compression: uint32,
  imageByteSize: uint32,
  horizontalResolution: int32,
  verticalResolution: int32,
  paletteColorCount: uint32,
  importantColorCount: uint32,
})

const colorTableEntryCodec = structure({
  blue: uint8,
  green: uint8,
  red: uint8,
  reserved: uint8,
})

function pixelDataCodec(
  imageWidth: number,
  imageHeight: number,
  bitsPerPixel: number,
) {
  const bytesPerPixel = Math.floor(bitsPerPixel / 8)
  const rowByteSize = imageWidth * bytesPerPixel
  const rowSizeWithPadding = ((rowByteSize + 3) >> 2) << 2
  const paddingSize = rowSizeWithPadding - rowByteSize

  return {
    decode(state: State) {
      const rows: Uint8Array[] = []
      for (let y = 0; y < imageHeight; y++) {
        const row = new Uint8Array(
          state.buffer.slice(
            state.position.byteIndex,
            state.position.byteIndex + rowByteSize,
          ),
        )
        rows.push(row)
        state.position = {
          byteIndex: state.position.byteIndex + rowSizeWithPadding,
          bitOffset: 0,
        }
      }
      return rows
    },
    encode(rows: Uint8Array[], state: State) {
      for (let y = 0; y < imageHeight; y++) {
        const row = rows[y]
        for (let x = 0; x < rowByteSize; x++) {
          state.setUint8(row[x])
        }
        for (let p = 0; p < paddingSize; p++) {
          state.setUint8(0)
        }
      }
    },
  }
}

export function decodeBmp(buffer: ArrayBuffer): Bmp {
  const state = new State(buffer, bmpEndian)
  magic([0x42, 0x4d]).decode(state)

  const fileHeader: BmpFileHeader = fileHeaderCodec.decode(state)
  const infoHeader: BmpInfoHeader = infoHeaderCodec.decode(state)

  const colorCount =
    infoHeader.bitsPerPixel <= 8
      ? infoHeader.paletteColorCount || 1 << infoHeader.bitsPerPixel
      : 0

  const colorTable: ColorTableEntry[] = fixedArray(
    colorCount,
    colorTableEntryCodec,
  ).decode(state)

  const pixelRows: Uint8Array[] = offset(
    fileHeader.pixelDataOffset,
    pixelDataCodec(
      infoHeader.imageWidth,
      Math.abs(infoHeader.imageHeight),
      infoHeader.bitsPerPixel,
    ),
  ).decode(state)

  return { fileHeader, infoHeader, colorTable, pixelRows }
}

export function encodeBmp(bmp: Bmp): ArrayBuffer {
  const { infoHeader, fileHeader } = bmp

  const colorCount =
    infoHeader.bitsPerPixel <= 8
      ? infoHeader.paletteColorCount || 1 << infoHeader.bitsPerPixel
      : 0

  const buffer = new ArrayBuffer(fileHeader.fileSize)
  const state = new State(buffer, bmpEndian)
  magic([0x42, 0x4d]).encode(undefined, state)
  fileHeaderCodec.encode(fileHeader, state)
  infoHeaderCodec.encode(infoHeader, state)
  fixedArray(colorCount, colorTableEntryCodec).encode(bmp.colorTable, state)
  offset(
    fileHeader.pixelDataOffset,
    pixelDataCodec(
      infoHeader.imageWidth,
      Math.abs(infoHeader.imageHeight),
      infoHeader.bitsPerPixel,
    ),
  ).encode(bmp.pixelRows, state)

  return buffer
}
