import { createRequire } from "node:module"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitepress"
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
  outDir: resolve(repoRoot, "build/docs"),
  cacheDir: resolve(repoRoot, "build/docs-cache"),

  cleanUrls: true,
  ignoreDeadLinks: [(link) => link.includes("../../diary/")],
  title: "x-lisp",
  description: "x-lisp documentation",

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
    languageAlias: {
      "meta-lisp": "scheme",
      "basic-lisp": "scheme",
      "xvm-lisp": "asm",
      "x86-lisp": "asm",
    },
  },

  themeConfig: {
    nav: [
      { text: "meta-lisp", link: "/meta-lisp/" },
      { text: "basic-lisp", link: "/basic-lisp/syntax" },
      { text: "xvm-lisp", link: "/xvm-lisp/syntax" },
      { text: "x86-lisp", link: "/x86-lisp/syntax" },
      { text: "元语", link: "/元语/" },
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
    },

    search: {
      provider: "local",
    },

    outline: {
      level: [2, 3],
    },
  },
})
