# Lisp Parentheses — AI 括号能力测试

## 测试目的

衡量 AI 模型在**没有视觉反馈**的情况下生成括号完全正确的 Meta-lisp 代码的能力。
覆盖 skill 中识别出的 5 个高风险模式：`let`/`let*`、`match`、`cond`、`begin`、深层嵌套。

## 前置条件

1. **评分人**准备好两个工具：
   - `SKILL.md` — 发给 AI 的方法论
   - `check-brackets.py` — 本地验证脚本
2. **AI** 能读取 SKILL.md 的内容（作为系统提示或首条消息）

## 评分表模板

| 测试用例        | 模式组合              | 括号总数 | 首次通过 | 备注 |
|-----------------|-----------------------|----------|----------|------|
| L1-let          | let*                  | 9        | ✓/✗      |      |
| L1-match        | match                 | 13       | ✓/✗      |      |
| L2-let-cond     | let*+cond             | 14       | ✓/✗      |      |
| L2-match-cond   | match+cond            | 20       | ✓/✗      |      |
| L3-deep-nest    | let*+match+cond+begin | 34       | ✓/✗      |      |
| L4-kitchen-sink | 全模式                | 80       | ✓/✗      |      |

## 运行全部测试

```bash
# 假设 AI 输出保存在 /tmp/ai-outputs/ 下
for f in /tmp/ai-outputs/L*.meta; do
  echo "=== $(basename $f) ==="
  python3 check-brackets.py "$f"
done
```

## 如何给 AI 发送测试

### 基本模板

```
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
  - sh scripts/check.sh # 类型检查
  - sh scripts/test.sh # 运行测试
```

## 解读结果

- **首次通过率**是核心指标。高首次通过率意味着 AI 能有效使用 SKILL.md 中的算法化方法替代视觉反馈。
- L4-kitchen-sink 是"终极测试"——80 对括号，多层嵌套，包含所有高风险模式。如果 AI 能一次通过 L4，说明它已经内化了括号匹配的算法化思维。
- 如果 AI 失败，用 `check-brackets.py` 的输出定位问题行和类型（EXTRA / UNMATCHED），让 AI 修正后再测。

## 扩展测试

### 测试 AI 的"裸"括号能力

不发 SKILL.md，直接发 prompt.md，看 AI 在没有方法论指导下的括号正确率。

### 测试 AI 的修正能力

第一次输出括号错误时，将 `check-brackets.py` 的报错信息返回给 AI，看它能否根据行列定位修复错误。

### 添加新测试用例

1. 在 `meta-bracket-test.meta/src/` 下新建目录，放入 `solution.meta`
2. 运行 `sh scripts/check.sh` 确保 type check 通过
3. 在 `tests/` 下新建目录，放入 `prompt.md`
4. 运行 `python3 check-brackets.py meta-bracket-test.meta/src/<new>/solution.meta > tests/<new>/solution.bracket-count.txt`
