---
title: list-drop
---

# 类型

```meta-lisp
(polymorphic (A) (-> int-t (list-t A) (list-t A)))
```

# 描述

去掉列表的前 `n` 个元素。`n` 大于列表长度时返回空列表。

# 例子

```meta-lisp
(list-drop 2 [1 2 3 4])  ;; => [3 4]
(list-drop 0 [1 2 3])    ;; => [1 2 3]
(list-drop 5 [1 2 3])    ;; => []
```
