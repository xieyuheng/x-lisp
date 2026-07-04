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
(format-json (json-null))             ;; => "null"
(format-json (json-bool true))        ;; => "true"
(format-json (json-number 42.0))      ;; => "42.0"
(format-json (json-string "hello"))   ;; => "\"hello\""
```
