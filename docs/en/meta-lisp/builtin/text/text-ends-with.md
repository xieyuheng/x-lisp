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
(text-ends-with "hello" "lo")  ;; => true
(text-ends-with "hello" "hi")  ;; => false
(text-ends-with "hello" "")    ;; => true
```
