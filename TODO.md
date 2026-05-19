[sexp.js] console.log test 改为 snapshot testing

examples/lambda.test.ts
75:    console.log(errorReport(error))

pretty/prettySexp.test.ts
8:      console.log(`${"-".repeat(width)}|${width}`)
9:      console.log(S.prettySexp(width, sexp))

直接使用 [helpers.js] 的 snapshot 辅助函数
