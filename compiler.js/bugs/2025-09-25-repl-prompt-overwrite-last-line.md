---
title: repl prompt overwrite last line
date: 2025-09-25
---

`(write "hi\n")` in repl is ok,
but `(write "hi")` in repl will not print `"hi"`.

This is a bug of nodejs' readline library.
[rl.prompt](https://nodejs.org/docs/latest/api/readline.html#rlpromptpreservecursor)
does not respect `preserveCursor`.

> rl.prompt([preserveCursor])
>
>     preserveCursor <boolean> If true,
>     prevents the cursor placement from being reset to 0.

bug report to nodejs: https://github.com/nodejs/node/issues/60004
