请用 Meta-lisp 写一个函数 `process-data`。要求：

- 接受两个参数：`input`（字符串）和 `threshold`（整数）
- 先定义一个枚举类型 `option-t`：
  - `(some (value E))`
  - `(none)`
- 用 `let*` 绑定三个变量：
  - `(input-len (string-length input))` — 计算输入长度
  - `(is-long (int-greater? input-len threshold))` — 判断是否超过阈值
  - `(result (if is-long (some input-len) (none)))` — 构造 option 值
- 用 `match` 匹配 `result`：
  - 匹配到 `(some len)` 时，用 `cond` 做判断：
    - `(int-greater? len 100)` → 用 `begin` 做两件事：先 `(println "large!")`，然后返回 `(ineg len)`
    - `(int-positive? len)` → 返回 `len`
    - `else` → 返回 `0`
  - 匹配到 `(none)` 时，用 `begin` 做两件事：先 `(println "empty!")`，然后返回 `0`

使用到的内置函数：`string-length`, `int-greater?`, `int-positive?`, `ineg`, `println`
使用到的语法：`define-enum`, `let*`, `if`, `match`, `cond`, `begin`, `else`

这个测试考察三模式组合 `let*` + `match` + `cond` + `begin` 的括号正确性，包含了深层嵌套。参考括号总数：34 开 34 闭。
