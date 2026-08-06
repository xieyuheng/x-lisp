---
title: text-to-symbol
---

# 类型

```meta-lisp
(-> text-t symbol-t)
```

# 描述

将字符串转换为符号。

# 例子

```meta-lisp
(text-to-symbol "foo")  ;; => 'foo
(text-to-symbol "42")   ;; => '42
```
