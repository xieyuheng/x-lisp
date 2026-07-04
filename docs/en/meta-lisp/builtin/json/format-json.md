---
title: format-json
---

# Type

```meta-lisp
(-> json-t string-t)
```

# Description

Format a `json-t` value as a JSON string.

# Examples

```meta-lisp
(format-json (json-null))             ;; => "null"
(format-json (json-bool true))        ;; => "true"
(format-json (json-number 42.0))      ;; => "42.0"
(format-json (json-string "hello"))   ;; => "\"hello\""
```
