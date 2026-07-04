---
title: pair-put-second!
---

# 类型

```meta-lisp
(polymorphic (A B) (-> B (pair-t A B) (pair-t A B)))
```

# 描述

替换 pair 的第二个元素。

# 例子

```meta-lisp
(let ((p (make-pair 1 "hello")))
  (pair-put-second! "world" p)
  (pair-second p))  ;; => "world"
```
