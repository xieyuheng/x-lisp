---
title: keyword?
---

# 类型

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# 描述

判断一个值是否为关键字。

# 例子

```meta-lisp
(keyword? :key)    ;; => true
(keyword? 'key)    ;; => false
(keyword? "key")   ;; => false
```
