---
title: set-delete
---

# 类型

```scheme
(polymorphic (E) (-> E (set-t E) (set-t E)))
```

# 描述

从集合中删除元素，返回新集合。

# 例子

```scheme
(set-delete 2 #{1 2 3})  ;; => #{1 3}
(set-delete 0 #{1 2 3})  ;; => #{1 2 3}
```
