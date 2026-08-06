---
title: symbol-to-text
---

# 类型

```meta-lisp
(-> symbol-t text-t)
```

# 描述

将符号转换为字符串。

# 例子

```meta-lisp
(symbol-to-text 'foo)   ;; => "foo"
(symbol-to-text '+)     ;; => "+"
```
