---
title: list-fold-right
---

# 类型

```meta-lisp
(polymorphic (E R) (-> (-> E R R) R (list-t E) R))
```

# 描述

从右到左折叠列表。

# 例子

```meta-lisp
(list-fold-right iadd 0 [1 2 3 4])     ;; => 10
(list-fold-right cons [] [1 2 3 4])    ;; => [1 2 3 4]
```
