---
title: hash-get
---

# 类型

```meta-lisp
(polymorphic (K V) (-> K (hash-t K V) V))
```

# 描述

根据键获取值。键不存在时报错。

# 例子

```meta-lisp
(hash-get "a" (@hash "a" 1 "b" 2))  ;; => 1
;; (hash-get "c" (@hash "a" 1 "b" 2))  ;; 错误：键不存在
```
