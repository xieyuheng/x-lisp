---
title: cons
---

# 类型

```scheme
(polymorphic (E) (-> E (list-t E) (list-t E)))
```

# 描述

在列表头部插入一个元素。

# 例子

```scheme
(cons 1 [2 3])    ;; => [1 2 3]
(cons "a" [])     ;; => ["a"]
```
