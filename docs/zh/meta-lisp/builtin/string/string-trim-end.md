---
title: string-trim-end
---

# 类型

```meta-lisp
(-> string-t string-t)
```

# 描述

删除字符串结尾的空白字符，同 `string-trim-right`。

# 例子

```meta-lisp
(string-trim-end "hello  ")  ;; => "hello"
(string-trim-end "  hello")  ;; => "  hello"
```
