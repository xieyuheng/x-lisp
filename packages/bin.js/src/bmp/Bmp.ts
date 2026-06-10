export type BmpFileHeader = {
  fileSize: number
  reserved: number
  pixelDataOffset: number
}

export type BmpInfoHeader = {
  headerSize: number
  imageWidth: number
  imageHeight: number
  colorPlanes: number
  bitsPerPixel: number
  compression: number
  imageByteSize: number
  horizontalResolution: number
  verticalResolution: number
  paletteColorCount: number
  importantColorCount: number
}

export type ColorTableEntry = {
  blue: number
  green: number
  red: number
  reserved: number
}

export type Bmp = {
  fileHeader: BmpFileHeader
  infoHeader: BmpInfoHeader
  colorTable: ColorTableEntry[]
  pixelRows: Uint8Array[]
}
