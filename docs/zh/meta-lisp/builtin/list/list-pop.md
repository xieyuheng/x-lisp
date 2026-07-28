---
title: list-pop
---

# 类型

```meta-lisp
(polymorphic (E) (-> (list-t E) E))
```

# 描述

弹出列表尾部的元素。

# 例子

```meta-lisp
(list-pop [1 2 3])  ;; => 3
(list-pop [1])      ;; => 1
```
