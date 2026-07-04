---
title: string-get-code-point
---

# Type

```scheme
(-> int-t string-t int-t)
```

# Description

Get the Unicode code point value of the `i`-th character in a string.

# Examples

```scheme
(string-get-code-point 0 "abc")  ;; => 97
(string-get-code-point 1 "abc")  ;; => 98
(string-get-code-point 0 "你")   ;; => 20320
```
