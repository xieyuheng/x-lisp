---
title: path-extension
---

# 类型

```scheme
(-> string-t string-t)
```

# 描述

获取文件扩展名（包含点号）。

# 例子

```scheme
(path-extension "/tmp/foo.txt")  ;; => ".txt"
(path-extension "/tmp/foo")      ;; => ""
```
