---
title: list-find
---

# 类型

```meta-lisp
(polymorphic (A) (-> (-> A bool-t) (list-t A) (maybe-t A)))
```

# 描述

查找列表中第一个满足条件的元素，返回 `(just value)` 或 `(nothing)`。

# 例子

```meta-lisp
(list-find is-int ['a 'b 3 'd])  ;; => (just 3)
(list-find is-int ['a 'b 'c])    ;; => (nothing)
```
