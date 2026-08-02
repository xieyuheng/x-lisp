---
title: parse-json
---

# 类型

```meta-lisp
(-> string-t json-t)
```

# 描述

将 JSON 字符串解析为 `json-t` 值。

# 例子

```meta-lisp
(parse-json "null")            ;; => (null-json)
(parse-json "true")            ;; => (bool-json true)
(parse-json "42")              ;; => (number-json 42.0)
(parse-json "\"hello\"")       ;; => (string-json "hello")
(parse-json "[1, 2, 3]")       ;; => (array-json [(number-json 1.0) ...])
(parse-json "{\"x\": 1}")      ;; => (object-json (@hash "x" (number-json 1.0)))
```
