---
title: is-text
---

# 类型

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# 描述

判断一个值是否为字符串。

# 例子

```meta-lisp
(is-text "hello")  ;; => true
(is-text 42)       ;; => false
(is-text 'foo)     ;; => false
```
