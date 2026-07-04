---
title: triple-put-second!
---

# 类型

```meta-lisp
(polymorphic (A B C) (-> B (triple-t A B C) (triple-t A B C)))
```

# 描述

替换 triple 的第二个元素。

# 例子

```meta-lisp
(let ((t (make-triple 1 "hello" #t)))
  (triple-put-second! "world" t)
  (triple-second t))  ;; => "world"
```
