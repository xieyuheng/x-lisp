---
title: text-trim-end
---

# 类型

```meta-lisp
(-> text-t text-t)
```

# 描述

删除字符串结尾的空白字符，同 `text-trim-right`。

# 例子

```meta-lisp
(text-trim-end "hello  ")  ;; => "hello"
(text-trim-end "  hello")  ;; => "  hello"
```
