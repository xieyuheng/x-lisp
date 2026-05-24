---
title: current-full-command-line
---

# 类型

```scheme
(-> (list-t string-t))
```

# 描述

获取传递给 xvm 可执行文件的完整命令行参数（包括可执行文件名和子命令）。

例如，给定调用：

```
xvm run program.xexe -- check --profile
```

`(current-full-command-line)` 返回
`("xvm" "run" "program.xexe" "--" "check" "--profile")`。

# 示例

```scheme
(current-full-command-line)
;; => ("xvm" "run" "program.xexe" "--" "check" "--profile")
```
