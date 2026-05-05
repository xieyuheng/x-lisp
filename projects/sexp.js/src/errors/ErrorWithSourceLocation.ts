import { sourceLocationReport, type SourceLocation } from "../token/index.ts"

export class ErrorWithSourceLocation extends Error {
  location: SourceLocation

  constructor(message: string, location: SourceLocation) {
    super(reportWithSourceLocation(message, location))
    this.location = location
  }
}

export function reportWithSourceLocation(
  message: string,
  location?: SourceLocation,
): string {
  if (location) {
    message += "\n"
    message += sourceLocationReport(location)
    return message
  } else {
    return message
  }
}
