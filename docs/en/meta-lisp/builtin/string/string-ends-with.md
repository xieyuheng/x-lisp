---
title: string-ends-with
---

# Type

```meta-lisp
(-> string-t string-t bool-t)
```

# Description

Check if a string ends with a specified suffix.

# Examples

```meta-lisp
(string-ends-with "hello" "lo")  ;; => true
(string-ends-with "hello" "hi")  ;; => false
(string-ends-with "hello" "")    ;; => true
```
