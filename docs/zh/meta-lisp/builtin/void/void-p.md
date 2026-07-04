---
title: void?
---

# 类型

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# 描述

判断一个值是否为 `void`。

# 例子

```meta-lisp
(void? void)    ;; => true
(void? 42)      ;; => false
```
