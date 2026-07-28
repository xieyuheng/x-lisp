---
title: set-union
---

# 类型

```meta-lisp
(polymorphic (E) (-> (set-t E) (set-t E) (set-t E)))
```

# 描述

求两个集合的并集。

# 例子

```meta-lisp
(set-union (@set 1 2) (@set 2 3))  ;; => (@set 1 2 3)
(set-union (@set 1) (@set))       ;; => (@set 1)
```
