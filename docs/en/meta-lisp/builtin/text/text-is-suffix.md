---
title: text-is-suffix
---

# Type

```meta-lisp
(-> text-t text-t bool-t)
```

# Description

Check if a text is a suffix of another text.

# Examples

```meta-lisp
(text-is-suffix "lo" "hello")  ;; => true
(text-is-suffix "hi" "hello")  ;; => false
(text-is-suffix "" "hello")    ;; => true
```
