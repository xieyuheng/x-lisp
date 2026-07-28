---
title: set-inter
---

# 类型

```meta-lisp
(polymorphic (E) (-> (set-t E) (set-t E) (set-t E)))
```

# 描述

求两个集合的交集。

# 例子

```meta-lisp
(set-inter (@set 1 2 3) (@set 2 3 4))  ;; => (@set 2 3)
(set-inter (@set 1) (@set 2))          ;; => (@set)
```
