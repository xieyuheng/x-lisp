---
title: parse-json
---

# Type

```meta-lisp
(-> string-t json-t)
```

# Description

Parse a JSON string into a `json-t` value.

# Examples

```meta-lisp
(parse-json "null")            ;; => (null-json)
(parse-json "true")            ;; => (bool-json true)
(parse-json "42")              ;; => (number-json 42.0)
(parse-json "\"hello\"")       ;; => (string-json "hello")
(parse-json "[1, 2, 3]")       ;; => (array-json [(number-json 1.0) ...])
(parse-json "{\"x\": 1}")      ;; => (object-json (@hash "x" (number-json 1.0)))
```
