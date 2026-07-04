---
title: list-take
---

# 类型

```meta-lisp
(polymorphic (A) (-> int-t (list-t A) (list-t A)))
```

# 描述

取列表的前 `n` 个元素。`n` 大于列表长度时返回整个列表。

# 例子

```meta-lisp
(list-take 2 [1 2 3 4])  ;; => [1 2]
(list-take 0 [1 2 3])    ;; => []
(list-take 5 [1 2 3])    ;; => [1 2 3]
```
