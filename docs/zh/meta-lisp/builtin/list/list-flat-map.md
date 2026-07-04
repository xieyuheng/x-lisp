---
title: list-flat-map
---

# 类型

```meta-lisp
(polymorphic (A B) (-> (-> A (list-t B)) (list-t A) (list-t B)))
```

# 描述

对列表中的每个元素应用函数 `f`，将结果列表扁平化一层。等价于 `(list-concat (list-map f xs))`。

# 例子

```meta-lisp
(list-flat-map (lambda (x) [x (iadd x 1)]) [1 3])  ;; => [1 2 3 4]
(list-flat-map (lambda (x) []) [1 2 3])           ;; => []
(list-flat-map list-reverse [[1 2 3] [4 5 6]])    ;; => [3 2 1 6 5 4]
```
