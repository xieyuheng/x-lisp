---
title: text-repeat
---

# Type

```meta-lisp
(-> text-t int-t text-t)
```

# Description

Repeat a text `n` times.

# Examples

```meta-lisp
(text-repeat "ab" 3)  ;; => "ababab"
(text-repeat "ab" 0)  ;; => ""
(text-repeat "ab" 1)  ;; => "ab"
```
