---
title: just-put-value
---

# 类型

```meta-lisp
(polymorphic (A) (-> A (maybe-t A) (maybe-t A)))
```

# 描述

替换 `just` 值中的内容。如果对 `nothing` 调用则会出错。

# 例子

```meta-lisp
(let ((m (just 42)))
  (just-put-value 7 m)
  (just-value m))  ;; => 7
```
