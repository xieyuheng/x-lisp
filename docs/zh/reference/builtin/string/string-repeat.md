---
title: string-repeat
---

# 类型

```scheme
(-> int-t string-t string-t)
```

# 描述

将字符串重复 `n` 次。派生函数。

# 例子

```scheme
(string-repeat 3 "ab")  ;; => "ababab"
(string-repeat 0 "ab")  ;; => ""
(string-repeat 1 "ab")  ;; => "ab"
```
