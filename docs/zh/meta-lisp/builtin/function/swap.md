---
title: swap
---

# 类型

```meta-lisp
(polymorphic (A B C)
  (-> (-> A B C)
      (-> B A C)))
```

# 描述

交换函数的两个参数顺序。

# 例子

```meta-lisp
(define (divide a b) (/ a b))
((swap divide) 2 10)  ;; => 5（等价于 (divide 10 2)）
```
