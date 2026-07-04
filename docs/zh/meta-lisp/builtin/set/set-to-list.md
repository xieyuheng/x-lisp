---
title: set-to-list
---

# 类型

```scheme
(polymorphic (E) (-> (set-t E) (list-t E)))
```

# 描述

将集合转为列表。

# 例子

```scheme
(set-to-list #{1 2 3})  ;; => [1 2 3]
(set-to-list #{})       ;; => []
```
