---
title: make-box
---

# 类型

```meta-lisp
(polymorphic (E) (-> (box-t E)))
```

# 描述

创建空 box。

# 例子

```meta-lisp
(define box (make-box))
(box-is-empty box) ;; => true
```
