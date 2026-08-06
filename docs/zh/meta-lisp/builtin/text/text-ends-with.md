---
title: text-ends-with
---

# 类型

```meta-lisp
(-> text-t text-t bool-t)
```

# 描述

判断字符串是否以指定后缀结尾。

# 例子

```meta-lisp
(text-ends-with "hello" "lo")  ;; => true
(text-ends-with "hello" "hi")  ;; => false
(text-ends-with "hello" "")    ;; => true
```
