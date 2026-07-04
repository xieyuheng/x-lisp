---
title: list-zip
---

# 类型

```scheme
(polymorphic (A B) (-> (list-t A) (list-t B) (list-t (pair-t A B))))
```

# 描述

将两个列表按对应位置配对。

# 例子

```scheme
(list-zip ['a 'b 'c] [1 2 3])   ;; => [(make-pair 'a 1) (make-pair 'b 2) (make-pair 'c 3)]
```
