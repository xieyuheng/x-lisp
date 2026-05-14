---
title: set-inter
---

# 类型

```scheme
(polymorphic (E) (-> (set-t E) (set-t E) (set-t E)))
```

# 描述

求两个集合的交集。

# 例子

```scheme
(set-inter #{1 2 3} #{2 3 4})  ;; => #{2 3}
(set-inter #{1} #{2})          ;; => #{}
```
