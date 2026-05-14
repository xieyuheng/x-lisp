---
title: string-lines
---

# 类型

```scheme
(-> string-t (list-t string-t))
```

# 描述

按换行符将字符串拆分为多行。

# 例子

```scheme
(string-lines "a\nb\nc")  ;; => ["a" "b" "c"]
(string-lines "abc")      ;; => ["abc"]
(string-lines "")         ;; => [""]
```
