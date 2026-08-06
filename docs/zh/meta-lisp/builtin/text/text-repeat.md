---
title: text-repeat
---

# 类型

```meta-lisp
(-> int-t text-t text-t)
```

# 描述

将字符串重复 `n` 次。

# 例子

```meta-lisp
(text-repeat 3 "ab")  ;; => "ababab"
(text-repeat 0 "ab")  ;; => ""
(text-repeat 1 "ab")  ;; => "ab"
```
