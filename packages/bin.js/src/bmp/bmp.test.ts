import assert from "node:assert"
import { test } from "node:test"
import {
  type Bmp,
  type BmpFileHeader,
  type BmpInfoHeader,
  type ColorTableEntry,
  decodeBmp,
  encodeBmp,
} from "./index.ts"

test("BMP round-trip: 1x1 24-bit image", () => {
  const fileHeader: BmpFileHeader = {
    fileSize: 58,
    reserved: 0,
    pixelDataOffset: 54,
  }

  const infoHeader: BmpInfoHeader = {
    headerSize: 40,
    imageWidth: 1,
    imageHeight: 1,
    colorPlanes: 1,
    bitsPerPixel: 24,
    compression: 0,
    imageByteSize: 4,
    horizontalResolution: 2835,
    verticalResolution: 2835,
    paletteColorCount: 0,
    importantColorCount: 0,
  }

  const colorTable: ColorTableEntry[] = []

  const pixelRows: Uint8Array[] = [new Uint8Array([255, 0, 0])]

  const original: Bmp = {
    fileHeader,
    infoHeader,
    colorTable,
    pixelRows,
  }

  const buffer = encodeBmp(original)
  const decoded = decodeBmp(buffer)

  assert.deepEqual(decoded, original)
})

test("BMP round-trip: 2x2 24-bit image", () => {
  const rowByteSize = 2 * 3
  const rowSizeWithPadding = ((rowByteSize + 3) >> 2) << 2
  const pixelDataSize = 2 * rowSizeWithPadding
  const pixelDataOffset = 54
  const fileSize = pixelDataOffset + pixelDataSize

  const fileHeader: BmpFileHeader = {
    fileSize,
    reserved: 0,
    pixelDataOffset,
  }

  const infoHeader: BmpInfoHeader = {
    headerSize: 40,
    imageWidth: 2,
    imageHeight: 2,
    colorPlanes: 1,
    bitsPerPixel: 24,
    compression: 0,
    imageByteSize: pixelDataSize,
    horizontalResolution: 2835,
    verticalResolution: 2835,
    paletteColorCount: 0,
    importantColorCount: 0,
  }

  const pixelRows: Uint8Array[] = [
    new Uint8Array([255, 0, 0, 0, 255, 0]),
    new Uint8Array([0, 0, 255, 255, 255, 0]),
  ]

  const original: Bmp = {
    fileHeader,
    infoHeader,
    colorTable: [],
    pixelRows,
  }

  const buffer = encodeBmp(original)
  const decoded = decodeBmp(buffer)

  assert.deepEqual(decoded, original)
})
