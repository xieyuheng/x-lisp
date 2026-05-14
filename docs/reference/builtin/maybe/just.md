---
title: just
---

# 类型

```scheme
(polymorphic (A) (-> A (maybe-t A)))
```

# 描述

`maybe-t` 的构造器，表示一个存在的值。

# 例子

```scheme
(just 42)    ;; 包含 42 的可选值
(just "hi")  ;; 包含 "hi" 的可选值
```
