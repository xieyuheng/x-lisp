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
(format-json (null-json))             ;; => "null"
(format-json (bool-json true))        ;; => "true"
(format-json (number-json 42.0))      ;; => "42.0"
(format-json (string-json "hello"))   ;; => "\"hello\""
```
