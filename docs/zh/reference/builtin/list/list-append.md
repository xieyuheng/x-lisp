---
title: list-append
---

# 类型

```scheme
(polymorphic (A) (-> (list-t A) (list-t A) (list-t A)))
```

# 描述

连接两个列表。派生函数。

# 例子

```scheme
(list-append [1 2 3] [4 5 6])  ;; => [1 2 3 4 5 6]
```
