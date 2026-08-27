---
title: text-to-int
---

# Type

```meta-lisp
(-> text-t int-t)
```

# Description

Parse a text to an integer. Behavior is undefined if the text is not a valid integer format.

# Examples

```meta-lisp
(text-to-int "42")    ;; => 42
(text-to-int "-1")    ;; => -1
(text-to-int "0")     ;; => 0
```
