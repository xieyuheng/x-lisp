---
title: set-union
---

# 类型

```scheme
(polymorphic (E) (-> (set-t E) (set-t E) (set-t E)))
```

# 描述

求两个集合的并集。

# 例子

```scheme
(set-union #{1 2} #{2 3})  ;; => #{1 2 3}
(set-union #{1} #{})       ;; => #{1}
```
