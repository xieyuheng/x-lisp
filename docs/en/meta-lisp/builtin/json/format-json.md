---
title: format-json
---

# Type

```meta-lisp
(-> json-t text-t)
```

# Description

Format a `json-t` value as a JSON text.

# Examples

```meta-lisp
(format-json (null-json))             ;; => "null"
(format-json (bool-json true))        ;; => "true"
(format-json (number-json 42.0))      ;; => "42.0"
(format-json (text-json "hello"))   ;; => "\"hello\""
```
