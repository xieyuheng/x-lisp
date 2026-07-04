---
title: list-tail
---

# 类型

```meta-lisp
(polymorphic (E) (-> (list-t E) (list-t E)))
```

# 描述

取列表除第一个元素外的剩余部分，同 `cdr`。

# 例子

```meta-lisp
(list-tail [1 2 3])  ;; => [2 3]
```
