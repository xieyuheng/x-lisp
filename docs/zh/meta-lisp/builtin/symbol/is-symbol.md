---
title: is-symbol
---

# 类型

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# 描述

判断一个值是否为符号。

# 例子

```meta-lisp
(is-symbol 'foo)    ;; => true
(is-symbol "foo")   ;; => false
(is-symbol 42)      ;; => false
```
