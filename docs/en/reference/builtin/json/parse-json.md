---
title: parse-json
---

# Type

```scheme
(-> string-t json-t)
```

# Description

Parse a JSON string into a `json-t` value.

# Examples

```scheme
(parse-json "null")            ;; => (json-null)
(parse-json "true")            ;; => (json-bool true)
(parse-json "42")              ;; => (json-number 42.0)
(parse-json "\"hello\"")       ;; => (json-string "hello")
(parse-json "[1, 2, 3]")       ;; => (json-array [(json-number 1.0) ...])
(parse-json "{\"x\": 1}")      ;; => (json-object (@hash "x" (json-number 1.0)))
```
