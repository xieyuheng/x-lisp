---
title: text-ends-with
---

# Type

```meta-lisp
(-> text-t text-t bool-t)
```

# Description

Check if a text ends with a specified suffix.

# Examples

```meta-lisp
(text-ends-with "lo" "hello")  ;; => true
(text-ends-with "hi" "hello")  ;; => false
(text-ends-with "" "hello")    ;; => true
```
