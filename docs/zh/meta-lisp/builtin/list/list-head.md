---
title: list-head
---

# 类型

```meta-lisp
(polymorphic (E) (-> (list-t E) E))
```

# 描述

取列表的第一个元素，同 `car`。

# 例子

```meta-lisp
(list-head [1 2 3])  ;; => 1
```
