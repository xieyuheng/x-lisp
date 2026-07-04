---
title: list-map
---

# 类型

```meta-lisp
(polymorphic (A B) (-> (-> A B) (list-t A) (list-t B)))
```

# 描述

对列表中的每个元素应用函数，返回结果列表。

# 例子

```meta-lisp
(list-map (iadd 10) [1 2 3])  ;; => [11 12 13]
(list-map string? [1 "a" 3])  ;; => [false true false]
```
