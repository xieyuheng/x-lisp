---
title: string-repeat
---

# Type

```meta-lisp
(-> int-t string-t string-t)
```

# Description

Repeat a string `n` times.

# Examples

```meta-lisp
(string-repeat 3 "ab")  ;; => "ababab"
(string-repeat 0 "ab")  ;; => ""
(string-repeat 1 "ab")  ;; => "ab"
```
