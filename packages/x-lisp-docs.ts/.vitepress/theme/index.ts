import { useData } from "vitepress"
import DefaultTheme from "vitepress/theme"
import { h } from "vue"
import { diaryMeta } from "./diaryMeta"
import "./style.css"

export default {
  extends: DefaultTheme,

  Layout() {
    const { frontmatter, page } = useData()

    return h(DefaultTheme.Layout, null, {
      "doc-before": () => {
        const title = frontmatter.value.title

        if (typeof title !== "string") return null

        const meta = page.value.relativePath.startsWith("diary/")
          ? diaryMeta(frontmatter.value, page.value.relativePath)
          : undefined

        return h("header", { class: "x-doc-header" }, [
          h("h1", { class: "x-doc-title" }, title),
          meta
            ? h("div", { class: "x-doc-meta" }, [
                meta.date
                  ? h("time", { datetime: meta.date }, meta.date)
                  : null,
                meta.date && meta.authors ? " · " : null,
                meta.authors
                  ? h("span", { class: "x-doc-author" }, meta.authors)
                  : null,
              ])
            : null,
        ])
      },
    })
  },
}
