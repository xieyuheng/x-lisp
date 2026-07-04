---
title: car
---

# 类型

```scheme
(polymorphic (E) (-> (list-t E) E))
```

# 描述

取列表的第一个元素。

# 例子

```scheme
(car [1 2 3])  ;; => 1
(car ["a" "b"])  ;; => "a"
```
