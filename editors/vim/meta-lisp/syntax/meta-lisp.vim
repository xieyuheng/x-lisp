if exists("b:current_syntax")
  finish
endif

syn match metaLispComment ";.*$" contains=@Spell

syn region metaLispString start=/"/ skip=/\\"/ end=/"/ oneline contains=@Spell

syn keyword metaLispSpecialForm define lambda
syn keyword metaLispSpecialForm let let* letrec letrec*
syn keyword metaLispSpecialForm if cond when unless and or
syn keyword metaLispSpecialForm begin match match-many
syn keyword metaLispSpecialForm pipe chain compose
syn keyword metaLispSpecialForm =
syn keyword metaLispSpecialForm module import import-as import-all private exempt
syn keyword metaLispSpecialForm claim claim-type admit the polymorphic
syn keyword metaLispSpecialForm interface extend-interface define-interface
syn keyword metaLispSpecialForm define-algebraic-type define-record-type
syn keyword metaLispSpecialForm define-struct define-struct* define-enum
syn keyword metaLispSpecialForm define-type define-opaque-type
syn keyword metaLispSpecialForm define-test
syn keyword metaLispSpecialForm assert assert-not assert-the
syn keyword metaLispSpecialForm assert-equal assert-not-equal

syn keyword metaLispAtForm @list @set @hash @quote @record @sexp

syn keyword metaLispConstant true false void

syn keyword metaLispType int-t float-t string-t symbol-t keyword-t
syn keyword metaLispType bool-t void-t file-t
syn keyword metaLispType list-t set-t hash-t maybe-t box-t

syn match metaLispKeywordValue ":\k\+"

syn match metaLispQualifiedName "\<\k\+\/\k\+\>"

syn match metaLispNumber "\<-\=\d\+\(\.\d\+\)\=\>"

syn match metaLispQuoteSymbol "'\k\+"

syn match metaLispParen "[()]"
syn match metaLispBracket "[\[\]]"

hi def link metaLispComment        Comment
hi def link metaLispString         String
hi def link metaLispSpecialForm    Statement
hi def link metaLispAtForm         PreProc
hi def link metaLispConstant       Boolean
hi def link metaLispType           Type
hi def link metaLispKeywordValue   Constant
hi def link metaLispQualifiedName  Type
hi def link metaLispNumber         Number
hi def link metaLispQuoteSymbol    String
hi def link metaLispParen          Delimiter
hi def link metaLispBracket        Delimiter

let b:current_syntax = "meta-lisp"
