---
title: same
---

# 类型

```meta-lisp
(polymorphic (A B) (-> A B bool-t))
```

# 描述

判断两个值是否原子相等或引用相等。

# 例子

```meta-lisp
(same 1 1)              ;; => true
(same "a" "a")          ;; => true
(same [1 2 3] [1 2 3])  ;; => false
```
