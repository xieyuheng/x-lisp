---
title: string-append
---

# Type

```meta-lisp
(-> string-t string-t string-t)
```

# Description

Concatenate two strings.

# Examples

```meta-lisp
(string-append "hello" " world")  ;; => "hello world"
(string-append "a" "b")           ;; => "ab"
(string-append "" "hello")        ;; => "hello"
```
