请用 Meta-lisp 写一个函数 `classify-number`。要求：

- 接受一个整数参数 `n`
- 用 `let*` 绑定两个变量：
  - `(pos? (int-positive? n))`
  - `(big? (int-greater? n 100))`
- 用 `cond` 做多分支判断：
  - `(not pos?)` 为真 → 返回 `"negative"`
  - `big?` 为真 → 返回 `"large"`
  - `else` → 返回 `"small"`

注意 `cond` 的 `else` 分支不需要双括号。

使用到的内置函数：`int-positive?`, `int-greater?`, `not`

这个测试考察双模式 `let*` + `cond` 的括号正确性。参考括号总数：14 开 14 闭。
