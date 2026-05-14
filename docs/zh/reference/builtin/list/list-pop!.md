---
title: list-pop!
---

# 类型

```scheme
(polymorphic (E) (-> (list-t E) E))
```

# 描述

弹出列表尾部的元素。

# 例子

```scheme
(list-pop! [1 2 3])  ;; => 3
(list-pop! [1])      ;; => 1
```
