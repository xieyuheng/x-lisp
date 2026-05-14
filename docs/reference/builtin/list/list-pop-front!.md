---
title: list-pop-front!
---

# 类型

```scheme
(polymorphic (E) (-> (list-t E) E))
```

# 描述

弹出列表头部的元素，同 `car`。

# 例子

```scheme
(list-pop-front! [1 2 3])  ;; => 1
```
