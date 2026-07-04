---
title: void?
---

# 类型

```scheme
(polymorphic (A) (-> A bool-t))
```

# 描述

判断一个值是否为 `void`。

# 例子

```scheme
(void? void)    ;; => true
(void? 42)      ;; => false
```
