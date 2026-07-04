---
title: pair?
---

# 类型

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# 描述

判断一个值是否为 pair。

# 例子

```meta-lisp
(pair? (make-pair 1 2))  ;; => true
(pair? 42)               ;; => false
```
