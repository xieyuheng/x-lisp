---
title: triple-put-third
---

# 类型

```meta-lisp
(polymorphic (A B C) (-> C (triple-t A B C) (triple-t A B C)))
```

# 描述

替换 triple 的第三个元素。

# 例子

```meta-lisp
(let ((t (make-triple 1 "hello" #t)))
  (triple-put-third #f t)
  (triple-third t))  ;; => false
```
