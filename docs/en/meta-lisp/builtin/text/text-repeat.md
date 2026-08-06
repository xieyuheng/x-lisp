---
title: text-repeat
---

# Type

```meta-lisp
(-> int-t text-t text-t)
```

# Description

Repeat a text `n` times.

# Examples

```meta-lisp
(text-repeat 3 "ab")  ;; => "ababab"
(text-repeat 0 "ab")  ;; => ""
(text-repeat 1 "ab")  ;; => "ab"
```
