---
title: text-split
---

# 类型

```meta-lisp
(-> text-t text-t (list-t text-t))
```

# 描述

按分隔符将字符串拆分为列表。

# 例子

```meta-lisp
(text-split "a,b,c" ",")     ;; => ["a" "b" "c"]
(text-split "hello" ",")     ;; => ["hello"]
(text-split "" ",")          ;; => [""]
```
