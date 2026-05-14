---
title: same?
---

# 类型

```scheme
(polymorphic (A B) (-> A B bool-t))
```

# 描述

判断两个值是否相同（引用相等）。

# 例子

```scheme
(same? 1 1)          ;; => true
(same? "a" "a")      ;; => false（字符串可能不共享引用）
```
