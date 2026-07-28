---
title: set-map
---

# 类型

```meta-lisp
(polymorphic (A B) (-> (-> A B) (set-t A) (set-t B)))
```

# 描述

对集合中的每个元素应用函数，返回结果集合。

# 例子

```meta-lisp
(set-map (lambda (n) (iadd n n)) (@set 1 2 3))  ;; => (@set 2 4 6)
```
