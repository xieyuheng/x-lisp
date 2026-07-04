---
title: cons
---

# 类型

```meta-lisp
(polymorphic (E) (-> E (list-t E) (list-t E)))
```

# 描述

在列表头部插入一个元素。

# 例子

```meta-lisp
(cons 1 [2 3])    ;; => [1 2 3]
(cons "a" [])     ;; => ["a"]
```
