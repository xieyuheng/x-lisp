---
title: set-clear!
---

# 类型

```meta-lisp
(polymorphic (E) (-> (set-t E) (set-t E)))
```

# 描述

清空集合，返回空集合。

# 例子

```meta-lisp
(set-clear! #{1 2 3})  ;; => #{}
```
