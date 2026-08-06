---
title: text-get-code-point
---

# Type

```meta-lisp
(-> int-t text-t int-t)
```

# Description

Get the Unicode code point value of the `i`-th character in a text.

# Examples

```meta-lisp
(text-get-code-point 0 "abc")  ;; => 97
(text-get-code-point 1 "abc")  ;; => 98
(text-get-code-point 0 "你")   ;; => 20320
```
