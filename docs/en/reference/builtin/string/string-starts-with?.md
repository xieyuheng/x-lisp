---
title: string-starts-with?
---

# Type

```scheme
(-> string-t string-t bool-t)
```

# Description

Check if a string starts with a specified prefix.

# Examples

```scheme
(string-starts-with? "hello" "he")  ;; => true
(string-starts-with? "hello" "hi")  ;; => false
(string-starts-with? "hello" "")    ;; => true
```
