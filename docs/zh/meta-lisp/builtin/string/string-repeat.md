---
title: string-repeat
---

# 类型

```meta-lisp
(-> int-t string-t string-t)
```

# 描述

将字符串重复 `n` 次。

# 例子

```meta-lisp
(string-repeat 3 "ab")  ;; => "ababab"
(string-repeat 0 "ab")  ;; => ""
(string-repeat 1 "ab")  ;; => "ab"
```
