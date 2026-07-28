---
title: is-triple
---

# 类型

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# 描述

判断一个值是否为 triple。

# 例子

```meta-lisp
(is-triple (make-triple 1 2 3))  ;; => true
(is-triple 42)                   ;; => false
```
