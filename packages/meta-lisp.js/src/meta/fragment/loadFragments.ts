import type { Fragment } from "./Fragment.ts"
import { loadMarkdownFragment } from "./loadMarkdownFragment.ts"
import { loadMetaFragment } from "./loadMetaFragment.ts"

export function loadFragments(path: string): Array<Fragment> {
  if (path.endsWith(".md")) {
    const fragment = loadMarkdownFragment(path)
    return fragment ? [fragment] : []
  }

  if (path.endsWith(".meta")) return [loadMetaFragment(path)]

  throw new Error(`[loadFragments] unexpected source file extension: ${path}`)
}
