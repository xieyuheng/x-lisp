---
title: triple?
---

# 类型

```scheme
(polymorphic (A) (-> A bool-t))
```

# 描述

判断一个值是否为 triple。

# 例子

```scheme
(triple? (make-triple 1 2 3))  ;; => true
(triple? 42)                   ;; => false
```
