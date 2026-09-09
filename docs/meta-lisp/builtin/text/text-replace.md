---
title: text-replace
---

# Type

```meta-lisp
(-> text-t text-t text-t text-t)
```

# Description

Replace all occurrences of `old` with `new` in a text.

# Examples

```meta-lisp
(text-replace "world" "there" "hello world")  ;; => "hello there"
(text-replace "a" "b" "aaa")                  ;; => "bbb"
(text-replace "x" "y" "abc")                  ;; => "abc"
```
