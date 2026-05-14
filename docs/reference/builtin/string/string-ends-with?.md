---
title: string-ends-with?
---

# 类型

```scheme
(-> string-t string-t bool-t)
```

# 描述

判断字符串是否以指定后缀结尾。

# 例子

```scheme
(string-ends-with? "hello" "lo")  ;; => true
(string-ends-with? "hello" "hi")  ;; => false
(string-ends-with? "hello" "")    ;; => true
```
