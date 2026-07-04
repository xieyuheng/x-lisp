---
title: fs-list
---

# 类型

```meta-lisp
(-> string-t (list-t string-t))
```

# 描述

列出目录中的条目。

# 例子

```meta-lisp
(fs-list "/tmp")  ;; => ["a.txt" "b.txt" "subdir"]
```
