---
title: list-unzip
---

# 类型

```scheme
(polymorphic (A B) (-> (list-t (pair-t A B)) (pair-t (list-t A) (list-t B))))
```

# 描述

将 pair 列表拆分为两个列表。派生函数。

# 例子

```scheme
(list-unzip [(make-pair 'a 1) (make-pair 'b 2)])  ;; => (make-pair ['a 'b] [1 2])
```
