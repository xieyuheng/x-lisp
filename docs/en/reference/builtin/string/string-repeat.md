---
title: string-repeat
---

# Type

```scheme
(-> int-t string-t string-t)
```

# Description

Repeat a string `n` times. Derived function.

# Examples

```scheme
(string-repeat 3 "ab")  ;; => "ababab"
(string-repeat 0 "ab")  ;; => ""
(string-repeat 1 "ab")  ;; => "ab"
```
