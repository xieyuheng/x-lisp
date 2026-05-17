---
title: path-relative-to-cwd
---

# 类型

```scheme
(-> string-t string-t)
```

# 描述

返回 `path` 相对于当前工作目录（cwd）的相对路径。

注意：cwd 始终是绝对路径，因此传入的 `path` 必须是绝对路径。
若 `path` 为相对路径，将触发断言错误。

# 例子

```scheme
(path-relative-to-cwd "/home/user/project/src")  ;; e.g. => "src"
(path-relative-to-cwd "/home/user")               ;; e.g. => ".."
```
