# meta-pass-dump

pass 级 IR 快照测试。编译时每个 pass 将 IR dump 到 `expected/dump/`，修改 pass 后用 `git diff expected/` 观察变化。

```bash
./scripts/build.sh && git diff expected/
./scripts/self-diff.sh   # 自举交叉验证
./scripts/clean.sh
```
