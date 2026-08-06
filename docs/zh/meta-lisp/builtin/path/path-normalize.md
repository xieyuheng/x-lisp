---
title: path-normalize
---

# 类型

```meta-lisp
(-> text-t text-t)
```

# 描述

标准化路径（解析 `..` 和 `.` 等）。

# 例子

```meta-lisp
(path-normalize "/tmp/foo/../bar")  ;; => "/tmp/bar"
```
