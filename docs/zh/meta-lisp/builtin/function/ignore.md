---
title: ignore
---

# 类型

```scheme
(polymorphic (A) (-> A void-t))
```

# 描述

接受任意值，返回 `void`。用于丢弃函数调用的返回值。

# 例子

```scheme
(ignore (hash-put! 'x 1 (make-hash)))  ;; => void
(ignore 1)                             ;; => void
```
