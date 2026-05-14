---
title: list-fold-left
---

# 类型

```scheme
(polymorphic (E R) (-> (-> R E R) R (list-t E) R))
```

# 描述

从左到右折叠列表。派生函数。

# 例子

```scheme
(list-fold-left iadd 0 [1 2 3 4])          ;; => 10
(list-fold-left (swap cons) [] [1 2 3 4])  ;; => [4 3 2 1]
```
