---
title: set-member?
---

# 类型

```meta-lisp
(polymorphic (E) (-> E (set-t E) bool-t))
```

# 描述

判断元素是否存在于集合中。

# 例子

```meta-lisp
(set-member? 2 #{1 2 3})  ;; => true
(set-member? 0 #{1 2 3})  ;; => false
```
