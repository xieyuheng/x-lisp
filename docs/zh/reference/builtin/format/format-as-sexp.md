---
title: format-as-sexp
---

# 类型

```scheme
(polymorphic (A) (-> A string-t))
```

# 描述

将任意值格式化为 S 表达式字符串。

# 例子

```scheme
(format-as-sexp '(a b c))  ;; => "(a b c)"
(format-as-sexp 42)        ;; => "42"
(format-as-sexp "hello")   ;; => "\"hello\""
```
