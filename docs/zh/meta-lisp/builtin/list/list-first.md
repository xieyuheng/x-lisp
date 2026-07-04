---
title: list-first
---

# 类型

```meta-lisp
(polymorphic (A) (-> (list-t A) A))
```

# 描述

取第一个元素，同 `car`。

# 例子

```meta-lisp
(list-first [1 2 3])  ;; => 1
```
