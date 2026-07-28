---
title: set-is-member
---

# 类型

```meta-lisp
(polymorphic (E) (-> E (set-t E) bool-t))
```

# 描述

判断元素是否存在于集合中。

# 例子

```meta-lisp
(set-is-member 2 (@set 1 2 3))  ;; => true
(set-is-member 0 (@set 1 2 3))  ;; => false
```
