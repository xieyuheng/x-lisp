---
title: string-trim-left
---

# 类型

```meta-lisp
(-> string-t string-t)
```

# 描述

删除字符串左侧的空白字符。

# 例子

```meta-lisp
(string-trim-left "  hello")  ;; => "hello"
(string-trim-left "hello  ")  ;; => "hello  "
(string-trim-left "hello")    ;; => "hello"
```
