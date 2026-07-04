---
title: set-clear!
---

# 类型

```scheme
(polymorphic (E) (-> (set-t E) (set-t E)))
```

# 描述

清空集合，返回空集合。

# 例子

```scheme
(set-clear! #{1 2 3})  ;; => #{}
```
