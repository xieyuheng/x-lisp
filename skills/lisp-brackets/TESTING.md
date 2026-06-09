# Lisp Parentheses — AI 括号能力测试

你是一个 Meta-lisp 代码生成器。
请先阅读 SKILL.md 来帮助你在写 lisp 代码的时候匹配括号。

然后，请根据 meta-bracket-test.meta/src/ 中 prompt.md 文件的描述：

./L1-let/prompt.md
./L1-match/prompt.md
./L2-let-cond/prompt.md
./L2-match-cond/prompt.md
./L3-deep-nest/prompt.md
./L4-kitchen-sink/prompt.md

对应的 solution.meta 文件中，生成 Meta-lisp 代码：

./L1-let/solution.meta
./L1-match/solution.meta
./L2-let-cond/solution.meta
./L2-match-cond/solution.meta
./L3-deep-nest/solution.meta
./L4-kitchen-sink/solution.meta

测试：

- 你可以使用 check-brackets.py 检查 meta-lisp 代码文件的括号是否匹配。
- 在 meta-bracket-test.meta/ 项目中，你可以使用 scripts/ 下工具：
  - ./scripts/check.sh # 类型检查
  - ./scripts/test.sh # 运行测试
