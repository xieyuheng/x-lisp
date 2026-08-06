---
title: text-length
---

# Type

```meta-lisp
(-> text-t int-t)
```

# Description

Return the number of characters in a text (in Unicode scalar values).

# Examples

```meta-lisp
(text-length "hello")  ;; => 5
(text-length "")       ;; => 0
(text-length "你好")   ;; => 2
```
