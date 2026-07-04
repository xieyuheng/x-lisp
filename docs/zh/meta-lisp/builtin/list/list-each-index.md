---
title: list-each-index
---

# 类型

```scheme
(polymorphic (A Any) (-> (-> int-t A Any) (list-t A) void-t))
```

# 描述

对列表中的每个元素执行带索引的副作用函数。

# 例子

```scheme
(list-each-index
 (lambda (i x)
   (print i)
   (write ": ")
   (println x))
 ['a 'b 'c])
;; 输出：
;; 0: a
;; 1: b
;; 2: c
```
