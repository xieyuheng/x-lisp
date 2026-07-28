---
title: set-subset
---

# 类型

```meta-lisp
(polymorphic (E) (-> (set-t E) (set-t E) bool-t))
```

# 描述

判断第一个集合是否为第二个的子集。

# 例子

```meta-lisp
(set-subset (@set 1 2) (@set 1 2 3))  ;; => true
(set-subset (@set 1 2 3) (@set 1 2))  ;; => false
(set-subset (@set) (@set 1 2 3))     ;; => true
```
