---
title: format-sexp
---

# 类型

```meta-lisp
(-> sexp-t text-t)
```

# 描述

将 S 表达式格式化为字符串。

# 例子

```meta-lisp
(format-sexp (@sexp (a b c)))  ;; => "(a b c)"
(format-sexp (@sexp 42))       ;; => "42"
```
