---
title: string-contains?
---

# Type

```scheme
(-> string-t string-t bool-t)
```

# Description

Check if a string contains a specified substring.

# Examples

```scheme
(string-contains? "hello" "ell")  ;; => true
(string-contains? "hello" "xyz")  ;; => false
(string-contains? "hello" "")     ;; => true
```
