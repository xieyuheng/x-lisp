[meta-lisp.meta] sh scripts/dev.sh 修复 [path_relative] 报错

现在要修复 [meta-lisp.meta] sh scripts/dev.sh 修复 [path_relative] 报错问题
现在的报错是：

$ sh scripts/dev.sh
[path_relative] from and to must be both absolute or both relative
[path_relative]   from: /home/xyh/projects/xieyuheng/meta-lisp/projects/meta-lisp.meta
[path_relative]   to:

我尝试注释掉了 [meta-lisp.meta] 代码中调用 path-relative 的地方，还是会遇到 [path_relative] 报错问题
请帮我查看一下还有可能是哪里在调用 path_relative？



[meta-lisp.meta] 迁移 [meta-lisp.js] 下列 pass 到 [meta-lisp.meta]

040-ExecutePass.ts
050-ClaimPass.ts
060-LowerMatchPass.ts
070-QualifyPass.ts

[meta-lisp.meta] 迁移 [meta-lisp.js] 下列 pass 到 [meta-lisp.meta]

080-CheckPass.ts

[meta-lisp.meta] 迁移 [meta-lisp.js] 下列 pass 到 [meta-lisp.meta]

090-LocatePass.ts
100-ShrinkPass.ts
110-UniquifyPass.ts
120-LiftLambdaPass.ts
130-UnnestOperandPass.ts
140-ExplicateControlPass.ts
150-CodegenPass.ts
