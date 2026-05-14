---
title: string-split
---

# 类型

```scheme
(-> string-t string-t (list-t string-t))
```

# 描述

按分隔符将字符串拆分为列表。

# 例子

```scheme
(string-split "a,b,c" ",")     ;; => ["a" "b" "c"]
(string-split "hello" ",")     ;; => ["hello"]
(string-split "" ",")          ;; => [""]
```
