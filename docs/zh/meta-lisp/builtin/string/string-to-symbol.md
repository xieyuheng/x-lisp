---
title: string-to-symbol
---

# 类型

```meta-lisp
(-> string-t symbol-t)
```

# 描述

将字符串转换为符号。

# 例子

```meta-lisp
(string-to-symbol "foo")  ;; => 'foo
(string-to-symbol "42")   ;; => '42
```
