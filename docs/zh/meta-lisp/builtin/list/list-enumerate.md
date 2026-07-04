---
title: list-enumerate
---

# 类型

```scheme
(polymorphic (A) (-> (list-t A) (list-t (pair-t int-t A))))
```

# 描述

将列表中的每个元素与其索引配对。

# 例子

```scheme
(list-enumerate [])            ;; => []
(list-enumerate ['a])          ;; => [(make-pair 0 'a)]
(list-enumerate ['a 'b 'c])    ;; => [(make-pair 0 'a) (make-pair 1 'b) (make-pair 2 'c)]
```
