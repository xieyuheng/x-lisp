---
title: text-get-code-point
---

# Type

```meta-lisp
(-> text-t int-t int-t)
```

# Description

Get the Unicode code point value of the `i`-th character in a text.

# Examples

```meta-lisp
(text-get-code-point "abc" 0)  ;; => 97
(text-get-code-point "abc" 1)  ;; => 98
(text-get-code-point "你" 0)   ;; => 20320
```
