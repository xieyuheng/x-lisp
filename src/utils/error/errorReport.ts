export function errorReport(error: unknown): void {
  if (error instanceof Error) {
    console.log(error.message)
  } else {
    console.log("unknown error:", error)
  }
}
