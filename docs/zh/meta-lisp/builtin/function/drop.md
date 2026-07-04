---
title: drop
---

# 类型

```meta-lisp
(polymorphic (A B C)
  (-> (-> A B)
      (-> C A B)))
```

# 描述

创建一个忽略第一个参数的新函数。

# 例子

```meta-lisp
(define (greet name) (println (string-append "Hello, " name)))
((drop greet) "ignored" "World")  ;; 输出 "Hello, World"
```
