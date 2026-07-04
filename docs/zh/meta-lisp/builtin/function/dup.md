---
title: dup
---

# 类型

```scheme
(polymorphic (A B)
  (-> (-> A A B)
      (-> A B)))
```

# 描述

创建一个将参数重复两次传给原函数的新函数。

# 例子

```scheme
((dup iadd) 3)  ;; => 6（等价于 (iadd 3 3)）
```
