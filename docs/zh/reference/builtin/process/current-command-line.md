---
title: current-command-line
---

# 类型

```scheme
(-> (list-t string-t))
```

# 描述

获取 `--` 分隔符之后的命令行参数。

当 xvm 可执行文件以 `--` 调用时，`--` 之后的所有参数将被收集为当前命令行。
例如：

```
xvm run program.xexe -- check --profile
```

`(current-command-line)` 返回 `("check" "--profile")`。

# 示例

```scheme
(current-command-line)  ;; => ("check" "--profile")
```
