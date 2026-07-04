---
title: hash-code
---

# 类型

```meta-lisp
(polymorphic (A) (-> A int-t))
```

# 描述

计算任意值的哈希码。

# 例子

```meta-lisp
(hash-code 42)       ;; => 42
(hash-code "hello")  ;; => 某个整数
```
