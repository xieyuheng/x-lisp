---
title: string-chars
---

# 类型

```scheme
(-> string-t (list-t string-t))
```

# 描述

将字符串拆分为单个字符的字符串列表。

# 例子

```scheme
(string-chars "abc")   ;; => ["a" "b" "c"]
(string-chars "")      ;; => []
(string-chars "你好")  ;; => ["你" "好"]
```
