import { createRequire } from "node:module"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { defineConfig } from "vitepress"

import { MetaLisp } from "./languages/meta-lisp"
import { demoteBodyHeadings } from "./markdown/demote-body-headings"
import { sidebarFor } from "./sidebar"

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, "../../..")
const docsDir = resolve(repoRoot, "docs")
const require = createRequire(import.meta.url)
const vueDir = dirname(require.resolve("vue/package.json"))
const vueServerRenderer = require.resolve("vue/server-renderer")

export default defineConfig({
  srcDir: docsDir,
  cleanUrls: true,
  title: "x-lisp",
  description: "x-lisp documentation",

  locales: {
    root: {
      label: "English",
      lang: "en-US",
      link: "/",
      title: "x-lisp",
      description: "x-lisp documentation",
    },
    zh: {
      label: "中文",
      lang: "zh-CN",
      link: "/zh/",
      title: "x-lisp",
      description: "x-lisp 文档",
    },
  },

  rewrites: {
    "meta-lisp/README.md": "meta-lisp/index.md",
    "元语/说明.md": "元语/index.md",
  },

  vite: {
    resolve: {
      alias: [
        {
          find: /^vue\/server-renderer$/,
          replacement: vueServerRenderer,
        },
        { find: /^vue$/, replacement: vueDir },
      ],
    },
  },

  markdown: {
    config(md) {
      demoteBodyHeadings(md)
    },
    languages: [MetaLisp],
    // Aliases to the custom meta-lisp grammar are declared in
    // ./languages/meta-lisp.ts, because VitePress resolves languageAlias
    // values as bundled Shiki language names.
    languageAlias: {
      "xvm-lisp": "asm",
      "x86-lisp": "asm",
      "calcit-lang": "clojure",
      sml: "ocaml",
      llvm: "asm",
    },
  },

  themeConfig: {
    nav: [
      {
        text: "GitHub",
        link: "https://github.com/xieyuheng/x-lisp",
        target: "_blank",
        rel: "noreferrer",
      },
    ],

    sidebar: {
      "/meta-lisp/": sidebarFor(resolve(docsDir, "meta-lisp"), "/meta-lisp/", {
        indexFiles: ["index.md", "README.md"],
      }),
      "/basic-lisp/": sidebarFor(
        resolve(docsDir, "basic-lisp"),
        "/basic-lisp/",
        { indexFiles: ["index.md"] },
      ),
      "/xvm-lisp/": sidebarFor(resolve(docsDir, "xvm-lisp"), "/xvm-lisp/", {
        indexFiles: ["index.md"],
      }),
      "/x86-lisp/": sidebarFor(resolve(docsDir, "x86-lisp"), "/x86-lisp/", {
        indexFiles: ["index.md"],
      }),
      "/元语/": sidebarFor(resolve(docsDir, "元语"), "/元语/", {
        indexFiles: ["index.md", "说明.md"],
      }),
      "/diary/": sidebarFor(resolve(docsDir, "diary"), "/diary/", {
        indexFiles: ["index.md"],
      }),
    },

    search: {
      provider: "local",
    },

    i18nRouting: false,
    langMenuLabel: "Change language / 切换语言",

    outline: {
      level: [2, 3],
    },
  },
})
