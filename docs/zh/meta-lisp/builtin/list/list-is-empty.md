---
title: list-is-empty
---

# 类型

```meta-lisp
(polymorphic (E) (-> (list-t E) bool-t))
```

# 描述

判断列表是否为空。

# 例子

```meta-lisp
(list-is-empty [])       ;; => true
(list-is-empty [1 2 3])  ;; => false
```
