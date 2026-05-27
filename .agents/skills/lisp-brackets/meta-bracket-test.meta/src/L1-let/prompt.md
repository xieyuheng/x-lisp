请用 Meta-lisp 写一个函数 `double-positive`。要求：

- 接受一个整数参数 `n`
- 用 `let*` 绑定 `(pos? (int-positive? n))`
- 用 `if` 判断：如果 `pos?` 为真，返回 `(imul n 2)`，否则返回 `0`

使用到的内置函数：`int-positive?`, `imul`

这个测试考察单模式 `let*` 的括号正确性。参考括号总数：9 开 9 闭。
