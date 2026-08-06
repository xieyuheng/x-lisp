---
title: path-list
---

# 类型

```meta-lisp
(-> text-t (list-t text-t))
```

# 描述

列出目录中的条目。

# 例子

```meta-lisp
(path-list "/tmp")  ;; => ["a.txt" "b.txt" "subdir"]
```
