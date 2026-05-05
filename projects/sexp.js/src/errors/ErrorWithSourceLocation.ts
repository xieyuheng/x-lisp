import * as S from "../index.ts"

export class ErrorWithSourceLocation extends Error {
  location: S.SourceLocation

  constructor(message: string, location: S.SourceLocation) {
    super(reportWithSourceLocation(message, location))
    this.location = location
  }
}

export function reportWithSourceLocation(
  message: string,
  location?: S.SourceLocation,
): string {
  if (location) {
    message += "\n"
    message += S.sourceLocationReport(location)
    return message
  } else {
    return message
  }
}
