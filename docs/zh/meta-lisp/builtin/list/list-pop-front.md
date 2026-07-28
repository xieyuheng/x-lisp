---
title: list-pop-front
---

# 类型

```meta-lisp
(polymorphic (E) (-> (list-t E) E))
```

# 描述

弹出列表头部的元素，同 `car`。

# 例子

```meta-lisp
(list-pop-front [1 2 3])  ;; => 1
```
