---
title: text-to-lower-case
---

# Type

```meta-lisp
(-> text-t text-t)
```

# Description

Convert all letters in a text to lower case.

# Examples

```meta-lisp
(text-to-lower-case "HELLO")  ;; => "hello"
(text-to-lower-case "Hello")  ;; => "hello"
(text-to-lower-case "123")    ;; => "123"
```
