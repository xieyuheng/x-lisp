import type { Fragment } from "./Fragment.ts"
import { loadMarkdownFragments } from "./loadMarkdownFragments.ts"
import { loadMetaFragment } from "./loadMetaFragment.ts"

export function loadFragments(path: string): Array<Fragment> {
  if (path.endsWith(".md")) return loadMarkdownFragments(path)
  if (path.endsWith(".meta")) return [loadMetaFragment(path)]
  throw new Error(`[loadFragments] unexpected source file extension: ${path}`)
}
