---
title: set-empty?
---

# 类型

```meta-lisp
(polymorphic (E) (-> (set-t E) bool-t))
```

# 描述

判断集合是否为空。

# 例子

```meta-lisp
(set-empty? #{})       ;; => true
(set-empty? #{1 2 3})  ;; => false
```
