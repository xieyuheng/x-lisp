---
title: list-concat
---

# 类型

```scheme
(polymorphic (A) (-> (list-t (list-t A)) (list-t A)))
```

# 描述

将列表的列表扁平化一层。派生函数。

# 例子

```scheme
(list-concat [[1 2] [3 4] [5]])  ;; => [1 2 3 4 5]
```
