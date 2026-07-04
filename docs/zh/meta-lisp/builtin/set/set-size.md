---
title: set-size
---

# 类型

```meta-lisp
(polymorphic (E) (-> (set-t E) int-t))
```

# 描述

返回集合中元素的个数。

# 例子

```meta-lisp
(set-size #{1 2 3})  ;; => 3
(set-size #{})       ;; => 0
```
