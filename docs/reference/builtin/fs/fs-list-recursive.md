---
title: fs-list-recursive
---

# 类型

```scheme
(-> string-t (list-t string-t))
```

# 描述

递归列出目录中所有条目。

# 例子

```scheme
(fs-list-recursive "/tmp")  ;; => ["/tmp/a.txt" "/tmp/subdir/b.txt"]
```
