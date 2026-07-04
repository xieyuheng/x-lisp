---
title: just-value
---

# 类型

```scheme
(polymorphic (A) (-> (maybe-t A) A))
```

# 描述

从 `just` 值中提取内容。如果对 `nothing` 调用则会出错。

# 例子

```scheme
(just-value (just 42))  ;; => 42
```
