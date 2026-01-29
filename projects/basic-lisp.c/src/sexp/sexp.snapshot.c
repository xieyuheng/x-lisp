#include "index.h"

int
main(void) {
    init_global_gc();
    init_constant_values();

    // symbol

    x_println(parse_sexps(NULL, "abc"));
    x_println(parse_sexps(NULL, "-sphere"));
    // TODO can not handle symbol starts with number
    // x_println(parse_sexps(NULL, "3-sphere"));

// test("parse -- hashtag", () => {
//   assertParse("#t", S.Hashtag("t"))
//   assertParse("#f", S.Hashtag("f"))
//   assertParse("#null", S.Hashtag("null"))
//   assertParse("#void", S.Hashtag("void"))
// })

// test("parse -- number", () => {
//   assertParse("1", S.Int(1n))
//   assertParse("0", S.Int(0n))
//   assertParse("-1", S.Int(-1n))
//   assertParse("0.0", S.Float(0.0))
//   assertParse("3.14", S.Float(3.14))
// })

// test("parse -- round brackets", () => {
//   assertParse("()", S.List([]))
//   assertParse("(a b c)", S.List([S.Symbol("a"), S.Symbol("b"), S.Symbol("c")]))
//   assertParse(
//     "(a (b) c)",
//     S.List([S.Symbol("a"), S.List([S.Symbol("b")]), S.Symbol("c")]),
//   )
// })

// test("parse -- square brackets", () => {
//   assertParse("[]", S.List([S.Symbol("@tael")]))
//   assertParse(
//     "[a b c]",
//     S.List([S.Symbol("@tael"), S.Symbol("a"), S.Symbol("b"), S.Symbol("c")]),
//   )
// })

// test("parse -- flower brackets", () => {
//   assertParse("{}", S.List([S.Symbol("@set")]))
//   assertParse(
//     "{a b c}",
//     S.List([S.Symbol("@set"), S.Symbol("a"), S.Symbol("b"), S.Symbol("c")]),
//   )
// })

// test("parse -- list with attributes", () => {
//   assertParse("(:x 1 :y 2)", S.Record({ x: S.Int(1n), y: S.Int(2n) }))
//   assertParse(
//     "(a b c :x 1 :y 2)",
//     S.Tael([S.Symbol("a"), S.Symbol("b"), S.Symbol("c")], {
//       x: S.Int(1n),
//       y: S.Int(2n),
//     }),
//   )
// })

// test("parse -- quotes", () => {
//   assertParse("'a", S.List([S.Symbol("@quote"), S.Symbol("a")]))
//   assertParse("'(a)", S.List([S.Symbol("@quote"), S.List([S.Symbol("a")])]))
//   assertParse("'(#a)", S.List([S.Symbol("@quote"), S.List([S.Hashtag("a")])]))
//   assertParse(
//     "'(a b c)",
//     S.List([
//       S.Symbol("@quote"),
//       S.List([S.Symbol("a"), S.Symbol("b"), S.Symbol("c")]),
//     ]),
//   )
//   assertParse(
//     ",(a b c)",
//     S.List([
//       S.Symbol("@unquote"),
//       S.List([S.Symbol("a"), S.Symbol("b"), S.Symbol("c")]),
//     ]),
//   )
//   assertParse(
//     "`(a ,b c)",
//     S.List([
//       S.Symbol("@quasiquote"),
//       S.List([
//         S.Symbol("a"),
//         S.List([S.Symbol("@unquote"), S.Symbol("b")]),
//         S.Symbol("c"),
//       ]),
//     ]),
//   )
// })
}
