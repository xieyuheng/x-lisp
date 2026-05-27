# Lisp Parentheses — AI 括号能力测试

## 测试目的

衡量 AI 模型在**没有视觉反馈**的情况下生成括号完全正确的 Meta-lisp 代码的能力。
覆盖 skill 中识别出的 5 个高风险模式：`let`/`let*`、`match`、`cond`、`begin`、深层嵌套。

## 目录结构

```
.agents/skills/lisp-brackets/
├── SKILL.md                  ← 括号匹配方法论（先发给 AI）
├── check-brackets.py           ← 括号验证脚本（评分人用）
├── TESTING.md                ← 本文件
├── meta-bracket-test.meta/     ← 参考 solution 的完整 Meta-lisp 项目（可 build / type-check）
│   ├── project.json
│   ├── meta-lisp.js
│   ├── scripts/check.sh
│   └── src/{L1-let,...,L4-kitchen-sink}/solution.meta
└── tests/                    ← 测试 prompts（发给 AI 的任务描述）
    ├── L1-let/prompt.md + solution.bracket-count.txt
    ├── L1-match/prompt.md + solution.bracket-count.txt
    ├── L2-let-cond/prompt.md + solution.bracket-count.txt
    ├── L2-match-cond/prompt.md + solution.bracket-count.txt
    ├── L3-deep-nest/prompt.md + solution.bracket-count.txt
    └── L4-kitchen-sink/prompt.md + solution.bracket-count.txt
```

## 前置条件

1. **评分人**准备好两个工具：
   - `SKILL.md` — 发给 AI 的方法论
   - `check-brackets.py` — 本地验证脚本
2. **AI** 能读取 SKILL.md 的内容（作为系统提示或首条消息）

## 评分流程

### 对单个测试：

**步骤 1** — 发送 `SKILL.md` 给 AI，让 AI 了解 4 步法和常见模式

**步骤 2** — 发送 `tests/L*/prompt.md` 给 AI，让 AI 生成代码

**步骤 3** — AI 返回代码后，将代码保存为 `.meta` 文件

**步骤 4** — 运行 `check-brackets.py` 验证括号：

```bash
python3 check-brackets.py <AI-output.meta>
```

**步骤 5** — 记录结果：
- **PASS first-try**：括号完全平衡，一次性成功
- **FAIL**：括号不平衡

### 进阶验证（可选）

如果 AI 输出的括号正确，可以将输出放入 `meta-bracket-test.meta/src/<level>/`，
替换 `solution.meta`，然后运行 type check：

```bash
cd meta-bracket-test.meta && sh scripts/check.sh
```

这验证 AI 的代码不仅是括号正确，而且语义上也使用了正确的内置函数。

## 评分表模板

| 测试用例 | 模式组合 | 括号总数 | 首次通过 | 备注 |
|----------|----------|----------|----------|------|
| L1-let | let* | 9 | ✓/✗ | |
| L1-match | match | 13 | ✓/✗ | |
| L2-let-cond | let*+cond | 14 | ✓/✗ | |
| L2-match-cond | match+cond | 20 | ✓/✗ | |
| L3-deep-nest | let*+match+cond+begin | 34 | ✓/✗ | |
| L4-kitchen-sink | 全模式 | 80 | ✓/✗ | |

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
你是一个 Meta-lisp 代码生成器。请先阅读并内化以下括号匹配方法论：

[粘贴 SKILL.md 全文]

---

现在请根据以下描述生成 Meta-lisp 代码。使用上述方法论的 4 步法，
确保生成的代码括号完全匹配。

[粘贴 tests/L*-kitchen-sink/prompt.md 内容]
```

### 如果模型不支持长上下文

可以分两轮：
1. 第一轮只发 SKILL.md，确认 AI 理解了方法论
2. 第二轮发 prompt.md，让 AI 生成代码

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
