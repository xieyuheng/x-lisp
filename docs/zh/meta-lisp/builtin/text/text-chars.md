---
title: text-chars
---

# 类型

```meta-lisp
(-> text-t (list-t text-t))
```

# 描述

将字符串拆分为单个字符的字符串列表。

# 例子

```meta-lisp
(text-chars "abc")   ;; => ["a" "b" "c"]
(text-chars "")      ;; => []
(text-chars "你好")  ;; => ["你" "好"]
```
