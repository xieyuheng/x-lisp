---
title: format-sexp
---

# 类型

```scheme
(polymorphic (A) (-> A string-t))
```

# 描述

将 S 表达式格式化为字符串。

# 例子

```scheme
(format-sexp '(a b c))  ;; => "(a b c)"
(format-sexp 42)        ;; => "42"
```
