# format

[bug] the position of attributes relative to elements, is lost

- example: x-lisp/examples/xml/bookstore.snapshot.lisp
- to solve this we need to get the insertion order of both elements and attributes.

[ppml] support `hardbreak` -- for line comment
[lexer] `EmptyLine` as `Token` -- for formatter
[parser] parse `EmptyLine` as `(@empty-line)`
[lexer] `Comment` as `Token` -- for formatter
[parser] `parseSexpWithComment`
[parser] parse `Comment` as `(@line-comment <comment-content>)`
