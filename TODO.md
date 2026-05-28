root scripts/ should call packages scripts/
setup clean.sh for meta packages

# package

[meta-lisp.js] `loadBuiltinPackage`
[meta-lisp.meta] [refactor] `package-dump-code`
[meta-lisp.meta] `load-builtin-package`
[meta-lisp.meta] `package-dump-fragments` fix the use of --dump -- should not include builtin
[meta-lisp.meta] `package-dump-mods` fix the use of --dump -- should not include builtin

# review

[meta-lisp.meta] [review] parse-exp.meta
[meta-lisp.meta] [review] parse-stmt.meta
[meta-lisp.meta] [review] 010-expand-pass.meta

# self-hosting

[meta-lisp.meta] 020-module-inject-builtin-pass.meta
[meta-lisp.meta] 030-module-analysis-pass.meta
[meta-lisp.meta] 040-algebraic-analysis-pass.meta
[meta-lisp.meta] 050-lower-match-pass.meta
[meta-lisp.meta] 060-desugar-pass.meta
[meta-lisp.meta] 070-module-import-pass.meta
[meta-lisp.meta] 080-execute-pass.meta
[meta-lisp.meta] 090-claim-pass.meta
[meta-lisp.meta] 100-qualify-pass.meta
[meta-lisp.meta] 110-check-pass.meta
[meta-lisp.meta] 120-locate-pass.meta
[meta-lisp.meta] 130-shrink-pass.meta
[meta-lisp.meta] 140-uniquify-pass.meta
[meta-lisp.meta] 150-lift-lambda-pass.meta
[meta-lisp.meta] 160-unnest-operand-pass.meta
[meta-lisp.meta] 170-explicate-control-pass.meta
[meta-lisp.meta] 180-codegen-pass.meta

# compile to native
# socket api and network programming
# http library
