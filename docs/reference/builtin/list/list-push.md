---
title: list-push
---

# 类型

```scheme
(polymorphic (E) (-> E (list-t E) (list-t E)))
```

# 描述

在列表尾部插入一个元素。

# 例子

```scheme
(list-push 4 [1 2 3])  ;; => [1 2 3 4]
(list-push 1 [])       ;; => [1]
```
