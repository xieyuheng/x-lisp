export type DiaryMeta = {
  date?: string
  authors?: string
}

function formatDate(value: unknown): string | undefined {
  if (typeof value === "string") {
    return /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : undefined
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }

  return undefined
}

function dateFromPath(relativePath: string): string | undefined {
  return relativePath.match(/\d{4}-\d{2}-\d{2}/)?.[0]
}

function normalizeAuthors(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value
  }

  if (Array.isArray(value)) {
    const authors = value.filter((item) => typeof item === "string")

    return authors.length > 0 ? authors.join(", ") : undefined
  }

  return undefined
}

export function diaryMeta(
  frontmatter: Record<string, unknown>,
  relativePath: string,
): DiaryMeta | undefined {
  const date = formatDate(frontmatter.date) ?? dateFromPath(relativePath)
  const authors = normalizeAuthors(frontmatter.author ?? frontmatter.authors)

  if (!date && !authors) return undefined

  return { date, authors }
}
