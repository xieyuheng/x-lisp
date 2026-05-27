请用 Meta-lisp 写一个函数 `describe-result`。要求：

- 先定义一个枚举类型 `result-t`：
  - `(ok (value A))` — 成功且有返回值
  - `(err (msg string-t))` — 失败且有错误信息
- 函数接受一个 `result-t` 类型的参数 `x`
- 用 `match` 做模式匹配：
  - 如果匹配到 `(ok v)`，用 `cond` 判断：
    - `(int-greater? v 100)` → 返回 `"big"`
    - `(int-less? v 10)` → 返回 `"small"`
    - `else` → 返回 `"medium"`
  - 如果匹配到 `(err msg)`，返回 `"error"`

注意 `cond` 的 `else` 分支不需要双括号。

使用到的内置函数：`define-enum`, `match`, `int-greater?`, `int-less?`

这个测试考察双模式 `match` + `cond` 的括号正确性。参考括号总数：20 开 20 闭。
