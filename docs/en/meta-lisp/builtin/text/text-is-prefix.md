---
title: text-is-prefix
---

# Type

```meta-lisp
(-> text-t text-t bool-t)
```

# Description

Check if a text is a prefix of another text.

# Examples

```meta-lisp
(text-is-prefix "he" "hello")  ;; => true
(text-is-prefix "hi" "hello")  ;; => false
(text-is-prefix "" "hello")    ;; => true
```
