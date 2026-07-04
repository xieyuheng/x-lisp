---
title: nothing
---

# 类型

```scheme
(polymorphic (A) (-> (maybe-t A)))
```

# 描述

`maybe-t` 的构造器，表示缺失的值。

# 例子

```scheme
(let ((m nothing))
  (nothing? m))  ;; => true
```
