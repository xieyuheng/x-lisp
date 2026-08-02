---
title: triple-t
---

# 类型

```meta-lisp
type-t
```

# 描述

三元组类型构造器。`(triple-t A B C)` 表示一个包含类型 `A`、`B` 和 `C` 三个值的组。

# 定义

```meta-lisp
(define-struct (triple-t A B C)
  (first A)
  (second B)
  (third C))
```

# 自动生成

```meta-lisp
(claim make-triple (polymorphic (A B C) (-> A B C (triple-t A B C))))
(claim is-triple (polymorphic (A) (-> A bool-t)))
(claim triple-first  (polymorphic (A B C) (-> (triple-t A B C) A)))
(claim triple-second (polymorphic (A B C) (-> (triple-t A B C) B)))
(claim triple-third  (polymorphic (A B C) (-> (triple-t A B C) C)))
(claim triple-put-first  (polymorphic (A B C) (-> A (triple-t A B C) (triple-t A B C))))
(claim triple-put-second (polymorphic (A B C) (-> B (triple-t A B C) (triple-t A B C))))
(claim triple-put-third  (polymorphic (A B C) (-> C (triple-t A B C) (triple-t A B C))))
```

# 例子

```meta-lisp
(let ((t (make-triple 1 "hello" #t)))
  (triple-first t))   ;; => 1
```
