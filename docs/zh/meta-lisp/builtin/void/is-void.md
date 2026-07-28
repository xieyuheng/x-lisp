---
title: is-void
---

# 类型

```meta-lisp
(polymorphic (A) (-> A bool-t))
```

# 描述

判断一个值是否为 `void`。

# 例子

```meta-lisp
(is-void void)    ;; => true
(is-void 42)      ;; => false
```
