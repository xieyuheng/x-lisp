---
title: parse-json
---

# 类型

```scheme
(-> string-t json-t)
```

# 描述

将 JSON 字符串解析为 `json-t` 值。

# 例子

```scheme
(parse-json "null")            ;; => (json-null)
(parse-json "true")            ;; => (json-bool true)
(parse-json "42")              ;; => (json-number 42.0)
(parse-json "\"hello\"")       ;; => (json-string "hello")
(parse-json "[1, 2, 3]")       ;; => (json-array [(json-number 1.0) ...])
(parse-json "{\"x\": 1}")      ;; => (json-object (@hash "x" (json-number 1.0)))
```
