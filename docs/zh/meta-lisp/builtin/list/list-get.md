---
title: list-get
---

# 类型

```meta-lisp
(polymorphic (E) (-> int-t (list-t E) E))
```

# 描述

按索引获取列表元素，从 0 开始。

# 例子

```meta-lisp
(list-get 0 [1 2 3])  ;; => 1
(list-get 2 [1 2 3])  ;; => 3
```
