#!/usr/bin/env node

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs"
import { resolve, relative, isAbsolute, dirname, basename, extname, join } from "node:path"
import { fileURLToPath } from "node:url"

const scriptDir = dirname(fileURLToPath(import.meta.url))

function stripLine(line) {
  const result = []
  let i = 0
  let inString = false
  let escape = false

  while (i < line.length) {
    const c = line[i]

    if (escape) {
      escape = false
      result.push(inString ? " " : c)
      i++
      continue
    }

    if (c === "\\" && inString) {
      escape = true
      result.push(" ")
      i++
      continue
    }

    if (c === '"') {
      inString = !inString
      result.push(" ")
      i++
      continue
    }

    if (inString) {
      result.push(" ")
    } else if (c === ";") {
      result.push(...Array(line.length - i).fill(" "))
      break
    } else if (c === "(" || c === ")") {
      result.push(c)
    } else {
      result.push(" ")
    }

    i++
  }

  return result.join("")
}

function checkFile(filepath) {
  let lines
  try {
    lines = readFileSync(filepath, "utf-8").split("\n")
  } catch (e) {
    if (e.code === "ENOENT") {
      process.stderr.write(`${filepath}: FILE NOT FOUND\n`)
      return true
    }
    process.stderr.write(`${filepath}: READ ERROR — ${e.message}\n`)
    return true
  }

  let depth = 0
  let lastOpenLine = null
  let lastOpenCol = null

  for (let lineno = 0; lineno < lines.length; lineno++) {
    const rawLine = lines[lineno]
    const masked = stripLine(rawLine)

    for (let col = 0; col < masked.length; col++) {
      const c = masked[col]
      if (c === "(") {
        depth++
        lastOpenLine = lineno + 1
        lastOpenCol = col
      } else if (c === ")") {
        depth--
        if (depth < 0) {
          const ruler = " ".repeat(col) + "^"
          console.log(`${filepath}:${lineno + 1}:${col + 1}  EXTRA ) — depth went negative (-1)`)
          console.log(`  L${lineno + 1}: ${rawLine}`)
          console.log(`         ${ruler}`)
          return false
        }
      }
    }
  }

  if (depth > 0) {
    console.log(`${filepath}:${lines.length}  UNMATCHED OPEN — ${depth} open bracket(s) never closed`)
    if (lastOpenLine !== null) {
      const colStr = lastOpenCol !== null ? `${lastOpenCol + 1}` : "?"
      console.log(`  Last opened: L${lastOpenLine}:${colStr}`)
      if (lastOpenLine <= lines.length) {
        console.log(`  L${lastOpenLine}: ${lines[lastOpenLine - 1]}`)
      }
    }
    return false
  }

  let openCount = 0
  let closeCount = 0
  for (const line of lines) {
    const masked = stripLine(line)
    for (const c of masked) {
      if (c === "(") openCount++
      if (c === ")") closeCount++
    }
  }
  console.log(`${filepath}: OK (${openCount} open, ${closeCount} close, depth 0)`)
  return true
}

function glob(pattern, baseDir) {
  const results = []
  const parts = pattern.split("/")

  function walk(dir, idx) {
    if (idx >= parts.length) {
      results.push(dir)
      return
    }

    const part = parts[idx]

    if (part === "**") {
      const entries = readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        const full = join(dir, entry.name)
        if (entry.isDirectory()) {
          walk(full, idx)
          walk(full, idx + 1)
        } else if (idx === parts.length - 1) {
          results.push(full)
        }
      }
      return
    }

    if (part.includes("*")) {
      const regex = new RegExp(
        "^" + part.replace(/\./g, "\\.").replace(/\*/g, ".*") + "$"
      )
      const entries = readdirSync(dir, { withFileTypes: true })
      const isLast = idx === parts.length - 1
      for (const entry of entries) {
        if (regex.test(entry.name)) {
          if (isLast && entry.isFile()) {
            results.push(join(dir, entry.name))
          } else if (!isLast && entry.isDirectory()) {
            walk(join(dir, entry.name), idx + 1)
          }
        }
      }
      return
    }

    const next = join(dir, part)
    if (existsSync(next)) {
      walk(next, idx + 1)
    }
  }

  walk(baseDir, 0)
  return results
}

function main() {
  if (process.argv.length < 3) {
    process.stderr.write("Usage: node check-brackets.mjs <file1.meta> [file2.meta ...]\n")
    process.stderr.write("       node check-brackets.mjs src/**/*.meta\n")
    process.exit(1)
  }

  let allOk = true

  for (const arg of process.argv.slice(2)) {
    if (isAbsolute(arg) || existsSync(arg)) {
      if (!checkFile(arg)) allOk = false
    } else if (arg.includes("*")) {
      const paths = glob(arg, ".")
      if (paths.length === 0) {
        process.stderr.write(`${arg}: NO FILES MATCHED\n`)
        allOk = false
        continue
      }
      for (const p of paths.sort()) {
        if (!checkFile(p)) allOk = false
      }
    } else {
      if (existsSync(arg)) {
        if (!checkFile(arg)) allOk = false
      } else {
        process.stderr.write(`${arg}: FILE NOT FOUND\n`)
        allOk = false
      }
    }
  }

  process.exit(allOk ? 0 : 1)
}

main()
