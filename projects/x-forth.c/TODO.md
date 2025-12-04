move sexp and lexer from helper to x-forth

# lang

> port inet-forth or inet-lisp

[lang] mod -- for the outer interpreter
[lang] definition

# lang

[lang] vm byte code design
[lang] worker

# outer interpreter

[lexer] port the lexer of sexp.js

- has full context -- `text` and `path` (or `url`)

[interpreter] forth outer interpreter -- run builtin functions like a calculator

- design with repl in mind

# sexp

[sexp] port sexp.js

- support comment this time
- with router like api
