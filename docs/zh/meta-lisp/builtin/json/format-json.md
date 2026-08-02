---
title: format-json
---

# 类型

```meta-lisp
(-> json-t string-t)
```

# 描述

将 `json-t` 值格式化为 JSON 字符串。

# 例子

```meta-lisp
(format-json (null-json))             ;; => "null"
(format-json (bool-json true))        ;; => "true"
(format-json (number-json 42.0))      ;; => "42.0"
(format-json (string-json "hello"))   ;; => "\"hello\""
```
