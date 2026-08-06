---
title: path-extension
---

# 类型

```meta-lisp
(-> text-t text-t)
```

# 描述

获取文件扩展名（包含点号）。

# 例子

```meta-lisp
(path-extension "/tmp/foo.txt")  ;; => ".txt"
(path-extension "/tmp/foo")      ;; => ""
```
