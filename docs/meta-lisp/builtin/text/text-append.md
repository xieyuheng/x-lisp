---
title: text-append
---

# Type

```meta-lisp
(-> text-t text-t text-t)
```

# Description

Concatenate two strings.

# Examples

```meta-lisp
(text-append "hello" " world")  ;; => "hello world"
(text-append "a" "b")           ;; => "ab"
(text-append "" "hello")        ;; => "hello"
```
