---
title: set-copy
---

# 类型

```meta-lisp
(polymorphic (E) (-> (set-t E) (set-t E)))
```

# 描述

复制一个集合，返回新集合。

# 例子

```meta-lisp
(set-copy #{1 2 3})  ;; => #{1 2 3}
```
