if exists("b:did_indent")
  finish
endif
let b:did_indent = 1

setlocal indentexpr=GetMetaLispIndent(v:lnum)
setlocal indentkeys+=0],0),0[,0(,=~,=;

" ============================================================================
" Spec table: maps keyword to indent spec number.
" 0 = all children are body.  1 = first child is special, rest body.
" ============================================================================

let s:keyword_specs = {}

let s:keyword_specs['module']                = 1
let s:keyword_specs['import']                = 1
let s:keyword_specs['import-as']             = 0
let s:keyword_specs['import-all']            = 0
let s:keyword_specs['exempt']                = 0
let s:keyword_specs['private']               = 0
let s:keyword_specs['claim']                 = 1
let s:keyword_specs['claim-type']            = 1
let s:keyword_specs['admit']                 = 1
let s:keyword_specs['define']                = 1
let s:keyword_specs['interface']             = 0
let s:keyword_specs['extend-interface']      = 1
let s:keyword_specs['define-interface']      = 1
let s:keyword_specs['define-enum']           = 1
let s:keyword_specs['define-algebraic-type'] = 1
let s:keyword_specs['define-struct']         = 1
let s:keyword_specs['define-struct*']        = 1
let s:keyword_specs['define-record-type']    = 1
let s:keyword_specs['define-test']           = 1
let s:keyword_specs['define-type']           = 1
let s:keyword_specs['define-opaque-type']    = 1
let s:keyword_specs['let']                   = 1
let s:keyword_specs['let*']                  = 1
let s:keyword_specs['letrec']                = 1
let s:keyword_specs['letrec*']               = 1
let s:keyword_specs['the']                   = 1
let s:keyword_specs['assert']                = 0
let s:keyword_specs['assert-not']            = 0
let s:keyword_specs['assert-the']            = 0
let s:keyword_specs['assert-equal']          = 0
let s:keyword_specs['assert-not-equal']      = 0
let s:keyword_specs['begin']                 = 0
let s:keyword_specs['lambda']                = 1
let s:keyword_specs['match']                 = 1
let s:keyword_specs['match-many']            = 1
let s:keyword_specs['pipe']                  = 1
let s:keyword_specs['chain']                 = 0
let s:keyword_specs['compose']               = 0
let s:keyword_specs['if']                    = 1
let s:keyword_specs['when']                  = 1
let s:keyword_specs['unless']                = 1
let s:keyword_specs['cond']                  = 0
let s:keyword_specs['polymorphic']           = 1

" ============================================================================
" Entry point
" ============================================================================

function! GetMetaLispIndent(lnum)
  let l:prev = prevnonblank(a:lnum - 1)
  if l:prev == 0
    return 0
  endif

  let l:curline = getline(a:lnum)
  if l:curline =~# '^\s*[])]'
    return s:CloseBracketIndent(a:lnum)
  endif

  let l:ctrl = s:FindControlling(a:lnum)
  if empty(l:ctrl)
    return 0
  endif

  if l:ctrl.char == '['
    return s:BracketIndent(l:ctrl)
  endif

  return s:ParenIndent(a:lnum, l:ctrl)
endfunction

" ============================================================================
" [] literal list indentation
" ============================================================================

function! s:BracketIndent(ctrl)
  let l:body = s:FindBodyStart(a:ctrl.lnum, a:ctrl.col, 0)
  return s:BodyIndent(a:ctrl.lnum, a:ctrl.col, l:body.lnum, l:body.col)
endfunction

" ============================================================================
" () sexp indentation
" ============================================================================

function! s:ParenIndent(lnum, ctrl)
  let l:keyword = s:ReadHeadSymbol(a:ctrl.lnum, a:ctrl.col)
  let l:spec = get(s:keyword_specs, l:keyword, v:null)

  if l:spec is v:null
    return s:FuncCallIndent(a:ctrl.lnum, a:ctrl.col)
  endif

  let l:body = s:FindBodyStart(a:ctrl.lnum, a:ctrl.col, l:spec)

  if l:body.lnum == 0 || l:body.lnum > a:lnum
    return s:FuncCallIndent(a:ctrl.lnum, a:ctrl.col)
  endif

  if l:body.lnum == a:lnum
    let l:line = getline(a:lnum)
    let l:first_col = match(l:line, '\S') + 1
    if l:first_col > 0 && l:first_col < l:body.col
      return s:FuncCallIndent(a:ctrl.lnum, a:ctrl.col)
    endif
  endif

  return s:BodyIndent(a:ctrl.lnum, a:ctrl.col, l:body.lnum, l:body.col)
endfunction

" ============================================================================
" Indent computation helpers
" ============================================================================

function! s:BodyIndent(open_lnum, open_col, body_start_lnum, body_start_col)
  if a:open_lnum == a:body_start_lnum
    return a:body_start_col - 1
  else
    return indent(a:open_lnum) + &shiftwidth
  endif
endfunction

function! s:FuncCallIndent(open_lnum, open_col)
  let l:save = getpos('.')

  call cursor(a:open_lnum, a:open_col + 1)
  call search('\S', 'W', a:open_lnum)

  let l:token_lnum = line('.')
  let l:token_col = col('.')

  call setpos('.', l:save)

  if l:token_lnum > a:open_lnum
    return indent(a:open_lnum) + &shiftwidth
  else
    return l:token_col - 1
  endif
endfunction

function! s:CloseBracketIndent(lnum)
  let l:line = getline(a:lnum)
  let l:col = match(l:line, '[])]') + 1
  let l:open = s:MatchCloseParen(a:lnum, l:col)
  if empty(l:open)
    return 0
  endif
  return indent(l:open.lnum)
endfunction

" ============================================================================
" Paren scanning
" ============================================================================

function! s:FindControlling(lnum)
  let l:save = getpos('.')
  call cursor(a:lnum, 1)

  let l:paren = searchpairpos('(', '', ')', 'bW', '', 1)
  let l:brak  = searchpairpos('\[', '', '\]', 'bW', '', 1)

  call setpos('.', l:save)

  if l:paren[0] == 0 && l:brak[0] == 0
    return {}
  endif

  if l:brak[0] == 0
    return {'lnum': l:paren[0], 'col': l:paren[1], 'char': '('}
  endif
  if l:paren[0] == 0
    return {'lnum': l:brak[0], 'col': l:brak[1], 'char': '['}
  endif

  if l:paren[0] > l:brak[0]
        \ || (l:paren[0] == l:brak[0] && l:paren[1] > l:brak[1])
    return {'lnum': l:paren[0], 'col': l:paren[1], 'char': '('}
  else
    return {'lnum': l:brak[0], 'col': l:brak[1], 'char': '['}
  endif
endfunction

function! s:ReadHeadSymbol(lnum, col)
  let l:line = getline(a:lnum)
  let l:tail = strpart(l:line, a:col)
  return matchstr(l:tail, '^\s*\zs[@a-zA-Z][-a-zA-Z0-9?!+*/=<>_]*')
endfunction

" ============================================================================
" Body start computation
" ============================================================================

function! s:FindBodyStart(open_lnum, open_col, skip_count)
  let l:save = getpos('.')
  call cursor(a:open_lnum, a:open_col + 1)

  let l:total = 1 + a:skip_count
  let l:i = 0
  while l:i < l:total
    call s:SkipWhitespace()
    call s:SkipOneSexp()
    let l:i += 1
  endwhile
  call s:SkipWhitespace()

  let l:result = {'lnum': line('.'), 'col': col('.')}
  call setpos('.', l:save)
  return l:result
endfunction

function! s:SkipWhitespace()
  while 1
    let l:lnum = line('.')
    let l:col = col('.')
    let l:line = getline(l:lnum)

    if l:col > len(l:line)
      if l:lnum == line('$')
        return
      endif
      call cursor(l:lnum + 1, 1)
      continue
    endif

    let l:c = l:line[l:col - 1]
    if l:c == ';'
      call cursor(l:lnum + 1, 1)
      continue
    endif

    if l:c !~# '\s'
      return
    endif

    call cursor(l:lnum, l:col + 1)
  endwhile
endfunction

function! s:SkipOneSexp()
  let l:lnum = line('.')
  let l:col = col('.')
  let l:line = getline(l:lnum)

  if l:col > len(l:line)
    return
  endif

  let l:c = l:line[l:col - 1]

  if l:c == '(' || l:c == '['
    let l:close_char = (l:c == '(') ? ')' : ']'
    let l:depth = 1
    while l:depth > 0 && l:lnum <= line('$')
      let l:col += 1
      if l:col > len(getline(l:lnum))
        let l:lnum += 1
        let l:col = 1
        if l:lnum > line('$')
          break
        endif
      endif
      let l:ch = getline(l:lnum)[l:col - 1]
      if l:ch == l:c
        let l:depth += 1
      elseif l:ch == l:close_char
        let l:depth -= 1
      endif
    endwhile
    if l:lnum <= line('$')
      call s:MoveCursorPast(l:lnum, l:col)
    endif
    return
  endif

  while l:col <= len(l:line) && l:line[l:col - 1] !~# '[ ()[\]]' && l:line[l:col - 1] != ';'
    let l:col += 1
  endwhile
  call s:MoveCursorTo(l:lnum, l:col)
endfunction

" ============================================================================
" Cursor positioning helpers
" ============================================================================

function! s:MoveCursorTo(lnum, col)
  let l:len = len(getline(a:lnum))
  if a:col > l:len
    if a:lnum < line('$')
      call cursor(a:lnum + 1, 1)
    else
      call cursor(a:lnum, l:len)
    endif
  else
    call cursor(a:lnum, a:col)
  endif
endfunction

function! s:MoveCursorPast(lnum, col)
  call s:MoveCursorTo(a:lnum, a:col + 1)
endfunction

" ============================================================================
" Matching parens for close-bracket indent
" ============================================================================

function! s:MatchCloseParen(lnum, col)
  let l:save = getpos('.')

  call cursor(a:lnum, a:col)

  let l:c = getline(a:lnum)[a:col - 1]
  if l:c == ')' || l:c == ']'
    execute 'normal! %'
    let l:result = {'lnum': line('.'), 'col': col('.')}
    call setpos('.', l:save)
    return l:result
  endif

  call setpos('.', l:save)
  return {}
endfunction
