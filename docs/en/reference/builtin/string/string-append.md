---
title: string-append
---

# Type

```scheme
(-> string-t string-t string-t)
```

# Description

Concatenate two strings.

# Examples

```scheme
(string-append "hello" " world")  ;; => "hello world"
(string-append "a" "b")           ;; => "ab"
(string-append "" "hello")        ;; => "hello"
```
