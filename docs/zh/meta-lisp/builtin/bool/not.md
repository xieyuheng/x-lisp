---
title: not
---

# 类型

```meta-lisp
(-> bool-t bool-t)
```

# 描述

逻辑非。将 `true` 变为 `false`，`false` 变为 `true`。

# 例子

```meta-lisp
(not true)   ;; => false
(not false)  ;; => true
(not (not true))  ;; => true
```
