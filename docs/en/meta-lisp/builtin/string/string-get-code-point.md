---
title: string-get-code-point
---

# Type

```meta-lisp
(-> int-t string-t int-t)
```

# Description

Get the Unicode code point value of the `i`-th character in a string.

# Examples

```meta-lisp
(string-get-code-point 0 "abc")  ;; => 97
(string-get-code-point 1 "abc")  ;; => 98
(string-get-code-point 0 "你")   ;; => 20320
```
