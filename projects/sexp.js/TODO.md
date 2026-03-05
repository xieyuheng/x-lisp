[sexp.js] use list instead of tael
[sexp.js] rename hashtag to keyword
[sexp.js] how to handle bool and void?

# format

[ppml] support `hardbreak` -- for line comment
[lexer] `EmptyLine` as `Token` -- for formatter
[parser] parse `EmptyLine` as `(@empty-line)`
[lexer] `Comment` as `Token` -- for formatter
[parser] `parseSexpWithComment`
[parser] parse `Comment` as `(@line-comment <comment-content>)`
