import { useData } from "vitepress"
import DefaultTheme from "vitepress/theme"
import { h } from "vue"
import "./style.css"

export default {
  extends: DefaultTheme,
  Layout() {
    const { frontmatter } = useData()

    return h(DefaultTheme.Layout, null, {
      "doc-before": () =>
        typeof frontmatter.value.title === "string"
          ? h("h1", { class: "x-doc-title" }, frontmatter.value.title)
          : null,
    })
  },
}
