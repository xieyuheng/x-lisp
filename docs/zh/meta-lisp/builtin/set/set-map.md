---
title: set-map
---

# 类型

```scheme
(polymorphic (A B) (-> (-> A B) (set-t A) (set-t B)))
```

# 描述

对集合中的每个元素应用函数，返回结果集合。

# 例子

```scheme
(set-map (lambda (n) (iadd n n)) #{1 2 3})  ;; => #{2 4 6}
```
