请用 Meta-lisp 写一个函数 `unwrap-option`。要求：

- 先定义一个枚举类型 `option-t`：
  - `(some (value E))` — 有值
  - `(none)` — 无值
- 函数接受一个 `option-t` 类型的参数 `x`
- 用 `match` 做模式匹配：
  - 如果匹配到 `(some v)`，返回 `v`
  - 如果匹配到 `(none)`，返回 `0`

使用到的内置函数/语法：`define-enum`, `match`

这个测试考察单模式 `match` 的括号正确性。参考括号总数：13 开 13 闭。
