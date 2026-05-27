请用 Meta-lisp 写一个包含以下内容的完整模块。

先定义两个代数类型：

1. `option-t E` — 可选值类型
   - `(some (value E))`
   - `(none)`

2. `pipeline-result-t E` — 管道结果类型
   - `(done (value E))` — 完成
   - `(failed (reason string-t))` — 失败
   - `(pending (stage symbol-t))` — 等待中

然后定义一个函数 `(run-pipeline n limit)`，接受两个整数参数：

- 用 `let*` 绑定 4 个变量：
  - `(a (imul n 2))` — a = n × 2
  - `(b (imul n 3))` — b = n × 3
  - `(c (int-compare-ascending a b))` — 比较 a 和 b
  - `(stage2 ...)` — 这是一个复杂的 match 表达式：

    用 `match` 匹配一个值。这个值由 `(if (int-greater? a limit) (some n) (none))` 构建。

    - 匹配到 `(some v)` 时：
      - 用 `cond` 做 4 个分支：
        1. `(int-greater? v 100)` → 用 `begin` 做两件事：打印 `"big"`，返回 `(done v)`
        2. `(int-greater? v 50)` → 用 `begin` 做两件事：打印 `"mid"`，返回 `(done (imul v 2))`
        3. `(int-positive? v)` → 返回 `(done v)`
        4. `else` → 返回 `(failed "non-positive")`

    - 匹配到 `(none)` 时：
      - 用 `cond` 做 3 个分支：
        1. `(int-greater? limit 1000)` → 返回 `(pending 'huge)`
        2. `(int-less? limit 10)` → 用 `begin` 做两件事：打印 `"tiny"`，返回 `(failed "too small limit")`
        3. `else` → 返回 `(failed "within range")`

- 最外层 body 使用 `if`：
  - 如果 `(done? stage2)` 为真（即 stage2 匹配到 done）：
    - 用 `begin` 做两件事：打印 `"success"`，然后：
      - 用 `let*` 绑定 `x = (done-value stage2)` 和 `y = (imul x x)`
      - 用 `cond` 做判断：`(int-greater? y 10000)` → `(begin (println "overflow") (done y))`，否则 `(done y)`
  - 否则直接返回 `stage2`

注意事项：
- `done?` 是 `define-enum` 自动生成的谓词（predicate），用于判断值是否为 `done` 构造
- `done-value` 是自动生成的访问器（accessor），用于提取 `done` 中的值
- `cond` 的 `else` 分支不需要双括号
- `begin` 的 body 不需要额外括号包裹
- `'huge` 是符号字面量（symbol literal）

使用到的内置函数：`imul`, `int-greater?`, `int-less?`, `int-compare-ascending`, `int-positive?`, `println`
使用到的语法：`define-enum`, `let*`, `if`, `match`, `cond`, `begin`, `else`, `'`

这个测试考察全模式深层嵌套的括号正确性。参考括号总数：80 开 80 闭。
