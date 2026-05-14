---
title: set-difference
---

# 类型

```scheme
(polymorphic (E) (-> (set-t E) (set-t E) (set-t E)))
```

# 描述

求两个集合的差集（第一个集合中有但第二个中没有的元素）。

# 例子

```scheme
(set-difference #{1 2 3} #{2 3})  ;; => #{1}
(set-difference #{1 2} #{1 2 3})  ;; => #{}
```
