---
title: path-list-recursive
---

# 类型

```meta-lisp
(-> text-t (list-t text-t))
```

# 描述

递归列出目录中所有条目。

# 例子

```meta-lisp
(path-list-recursive "/tmp")  ;; => ["/tmp/a.txt" "/tmp/subdir/b.txt"]
```
