import type MarkdownIt from "markdown-it"

export function demoteBodyHeadings(md: MarkdownIt): void {
  md.core.ruler.push("x-lisp:demote-body-headings", (state) => {
    if (typeof state.env.frontmatter?.title !== "string") return

    const firstHeading = state.tokens.find(
      (token) => token.type === "heading_open",
    )

    if (firstHeading?.tag !== "h1") return

    for (const token of state.tokens) {
      if (token.type === "heading_open" || token.type === "heading_close") {
        token.tag = `h${Number(token.tag.slice(1)) + 1}`
      }
    }
  })
}
