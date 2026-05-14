---
title: total-compare
---

# 类型

```scheme
(polymorphic (A B) (-> A B int-t))
```

# 描述

全序比较。返回负数、零或正数，分别表示第一个值小于、等于或大于第二个值。

# 例子

```scheme
(total-compare 1 2)   ;; => 负数
(total-compare 2 2)   ;; => 0
(total-compare 3 2)   ;; => 正数
```
