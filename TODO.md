现在 [meta-lisp.js] 中所有 location 都不是可选的而是必须存在的了，但是有些地方在报错的时候，
还是在根据 location 存在与否，而选择不同的报错方式。

比如：

      if (exp.location)
        throw new S.ErrorWithSourceLocation(message, exp.location)
      else throw new Error(message)

现在都需要改成直接

      throw new S.ErrorWithSourceLocation(message, exp.location)

迁移 [meta-lisp.js] 的 050-ClaimPass.ts 到 [meta-lisp.meta] 的 050-claim-pass.meta
迁移 [meta-lisp.js] 的 060-LowerMatchPass.ts 到 [meta-lisp.meta] 的 060-lower-match-pass.meta
迁移 [meta-lisp.js] 的 070-QualifyPass.ts 到 [meta-lisp.meta] 的 070-qualify-pass.meta
迁移 [meta-lisp.js] 的 080-CheckPass.ts 到 [meta-lisp.meta] 的 080-check-pass.meta
迁移 [meta-lisp.js] 的 090-LocatePass.ts 到 [meta-lisp.meta] 的 090-locate-pass.meta
迁移 [meta-lisp.js] 的 100-ShrinkPass.ts 到 [meta-lisp.meta] 的 100-shrink-pass.meta
迁移 [meta-lisp.js] 的 110-UniquifyPass.ts 到 [meta-lisp.meta] 的 110-uniquify-pass.meta
迁移 [meta-lisp.js] 的 120-LiftLambdaPass.ts 到 [meta-lisp.meta] 的 120-lift-lambda-pass.meta
迁移 [meta-lisp.js] 的 130-UnnestOperandPass.ts 到 [meta-lisp.meta] 的 130-unnest-operand-pass.meta
迁移 [meta-lisp.js] 的 140-ExplicateControlPass.ts 到 [meta-lisp.meta] 的 140-explicate-control-pass.meta
迁移 [meta-lisp.js] 的 150-CodegenPass.ts 到 [meta-lisp.meta] 的 150-codegen-pass.meta
