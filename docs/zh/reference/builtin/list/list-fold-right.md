---
title: list-fold-right
---

# 类型

```scheme
(polymorphic (E R) (-> (-> E R R) R (list-t E) R))
```

# 描述

从右到左折叠列表。派生函数。

# 例子

```scheme
(list-fold-right iadd 0 [1 2 3 4])     ;; => 10
(list-fold-right cons [] [1 2 3 4])    ;; => [1 2 3 4]
```
