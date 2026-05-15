---
title: Builtin Functions Index
---

# Builtin Functions Index

All builtin functions in meta-lisp, categorized by functionality.

- [Generic](#generic)
- [Booleans](#booleans)
- [Integers](#integers)
- [Floats](#floats)
- [Strings](#strings)
- [Symbols](#symbols)
- [Keywords](#keywords)
- [void](#void)
- [Lists](#lists)
- [Sets](#sets)
- [Hash tables](#hash-tables)
- [Pair](#pair)
- [Maybe](#maybe)
- [Box](#box)
- [Function operations](#function-operations)
- [File I/O](#file-io)
- [File system](#file-system)
- [Path operations](#path-operations)
- [Assertions](#assertions)
- [Error handling](#error-handling)
- [Process](#process)
- [Random](#random)
- [S-expressions](#s-expressions)
- [Type](#type)

## Generic

Operations applicable to all types.

- [`atom?`](value/atom?.md) — Check if a value is an atom
- [`same?`](value/same?.md) — Reference equality
- [`equal?`](value/equal?.md) — Structural equality
- [`format`](value/format.md) — Format any value as a string
- [`hash-code`](value/hash-code.md) — Compute hash code
- [`total-compare`](value/total-compare.md) — Total order comparison

## Booleans

Operations on `bool-t`.

- [`bool?`](bool/bool?.md) — Check if a value is a boolean
- [`not`](bool/not.md) — Logical not

## Integers

Operations on `int-t`.

### Type check

- [`int?`](int/int?.md) — Check if a value is an integer

### Arithmetic

- [`ineg`](int/ineg.md) — Negation
- [`iadd`](int/iadd.md) — Addition
- [`isub`](int/isub.md) — Subtraction
- [`imul`](int/imul.md) — Multiplication
- [`idiv`](int/idiv.md) — Integer division
- [`imod`](int/imod.md) — Modulo

### Predicates

- [`int-positive?`](int/int-positive?.md) — Check if positive
- [`int-non-negative?`](int/int-non-negative?.md) — Check if non-negative
- [`int-non-zero?`](int/int-non-zero?.md) — Check if non-zero

### Comparisons

- [`int-less?`](int/int-less?.md) — Less than
- [`int-greater?`](int/int-greater?.md) — Greater than
- [`int-less-or-equal?`](int/int-less-or-equal?.md) — Less than or equal
- [`int-greater-or-equal?`](int/int-greater-or-equal?.md) — Greater than or equal
- [`int-compare-ascending`](int/int-compare-ascending.md) — Ascending comparison function
- [`int-compare-descending`](int/int-compare-descending.md) — Descending comparison function

### Extremum

- [`int-min`](int/int-min.md) — Smaller of two values
- [`int-max`](int/int-max.md) — Larger of two values

### Derived

- [`int-sum`](int/int-sum.md) — Sum of a list
- [`int-product`](int/int-product.md) — Product of a list
- [`int-align`](int/int-align.md) — Align to a multiple

## Floats

Operations on `float-t`.

### Type check

- [`float?`](float/float?.md) — Check if a value is a float

### Arithmetic

- [`fneg`](float/fneg.md) — Negation
- [`fadd`](float/fadd.md) — Addition
- [`fsub`](float/fsub.md) — Subtraction
- [`fmul`](float/fmul.md) — Multiplication
- [`fdiv`](float/fdiv.md) — Division
- [`fmod`](float/fmod.md) — Modulo

### Predicates

- [`float-positive?`](float/float-positive?.md) — Check if positive
- [`float-non-negative?`](float/float-non-negative?.md) — Check if non-negative
- [`float-non-zero?`](float/float-non-zero?.md) — Check if non-zero

### Comparisons

- [`float-less?`](float/float-less?.md) — Less than
- [`float-greater?`](float/float-greater?.md) — Greater than
- [`float-less-or-equal?`](float/float-less-or-equal?.md) — Less than or equal
- [`float-greater-or-equal?`](float/float-greater-or-equal?.md) — Greater than or equal
- [`float-compare-ascending`](float/float-compare-ascending.md) — Ascending comparison function
- [`float-compare-descending`](float/float-compare-descending.md) — Descending comparison function

### Extremum

- [`float-min`](float/float-min.md) — Smaller of two values
- [`float-max`](float/float-max.md) — Larger of two values

### Derived

- [`float-sum`](float/float-sum.md) — Sum of a list
- [`float-product`](float/float-product.md) — Product of a list

## Strings

Operations on `string-t`.

### Type checks

- [`string?`](string/string?.md) — Check if a value is a string
- [`string-int?`](string/string-int?.md) — Check if string is integer format
- [`string-float?`](string/string-float?.md) — Check if string is float format

### Basics

- [`string-length`](string/string-length.md) — Length
- [`string-empty?`](string/string-empty?.md) — Check if empty
- [`string-blank?`](string/string-blank?.md) — Check if blank

### Concatenation and splitting

- [`string-append`](string/string-append.md) — Append two strings
- [`string-concat`](string/string-concat.md) — Concatenate a list of strings
- [`string-substring`](string/string-substring.md) — Extract substring
- [`string-split`](string/string-split.md) — Split by delimiter
- [`string-join`](string/string-join.md) — Join with delimiter

### Search and replace

- [`string-starts-with?`](string/string-starts-with?.md) — Check prefix
- [`string-ends-with?`](string/string-ends-with?.md) — Check suffix
- [`string-contains?`](string/string-contains?.md) — Check if contains substring
- [`string-find-index`](string/string-find-index.md) — Find substring position
- [`string-replace`](string/string-replace.md) — Replace substring

### Trimming

- [`string-trim`](string/string-trim.md) — Trim both ends
- [`string-trim-start`](string/string-trim-start.md) — Trim start
- [`string-trim-end`](string/string-trim-end.md) — Trim end
- [`string-trim-left`](string/string-trim-left.md) — Trim left
- [`string-trim-right`](string/string-trim-right.md) — Trim right

### Case conversion

- [`string-to-lower-case`](string/string-to-lower-case.md) — Convert to lower case
- [`string-to-upper-case`](string/string-to-upper-case.md) — Convert to upper case

### Type conversion

- [`string-to-int`](string/string-to-int.md) — Parse string to integer
- [`string-to-float`](string/string-to-float.md) — Parse string to float
- [`string-to-symbol`](string/string-to-symbol.md) — Convert string to symbol

### Characters and code points

- [`string-chars`](string/string-chars.md) — Split into character list
- [`string-get-code-point`](string/string-get-code-point.md) — Get code point
- [`string-lines`](string/string-lines.md) — Split into lines

### Derived

- [`string-repeat`](string/string-repeat.md) — Repeat a string
- [`string-compare-lexical`](string/string-compare-lexical.md) — Lexicographic comparison

## Symbols

Operations on `symbol-t`.

- [`symbol?`](symbol/symbol?.md) — Check if a value is a symbol
- [`symbol-length`](symbol/symbol-length.md) — Length of symbol name
- [`symbol-append`](symbol/symbol-append.md) — Append two symbols
- [`symbol-concat`](symbol/symbol-concat.md) — Concatenate a list of symbols
- [`symbol-to-string`](symbol/symbol-to-string.md) — Convert to string

## Keywords

Operations on `keyword-t`.

- [`keyword?`](keyword/keyword?.md) — Check if a value is a keyword
- [`keyword-length`](keyword/keyword-length.md) — Length of keyword name
- [`keyword-append`](keyword/keyword-append.md) — Append two keywords
- [`keyword-concat`](keyword/keyword-concat.md) — Concatenate a list of keywords
- [`keyword-to-string`](keyword/keyword-to-string.md) — Convert to string

## void

- [`void?`](void/void?.md) — Check if a value is void

## Lists

Operations on `(list-t E)`.

### Type and construction

- [`list-t`](list/list-t.md) — List type constructor
- [`make-list`](list/make-list.md) — Create an empty list
- [`list?`](list/list?.md) — Check if a value is a list
- [`cons`](list/cons.md) — Prepend an element

### Access

- [`car`](list/car.md) — First element
- [`cdr`](list/cdr.md) — Rest of the list
- [`list-head`](list/list-head.md) — First n elements
- [`list-tail`](list/list-tail.md) — Drop first n elements
- [`list-first`](list/list-first.md) — First element
- [`list-second`](list/list-second.md) — Second element
- [`list-third`](list/list-third.md) — Third element
- [`list-last`](list/list-last.md) — Last element
- [`list-init`](list/list-init.md) — All but last element
- [`list-get`](list/list-get.md) — Get element by index

### Info

- [`list-length`](list/list-length.md) — List length
- [`list-empty?`](list/list-empty?.md) — Check if empty
- [`list-member?`](list/list-member?.md) — Check if contains element

### Mutation

- [`list-copy`](list/list-copy.md) — Copy a list
- [`list-put`](list/list-put.md) — Replace at index (immutable)
- [`list-put!`](list/list-put!.md) — Replace at index (mutable)
- [`list-push`](list/list-push.md) — Append at end (immutable)
- [`list-push!`](list/list-push!.md) — Append at end (mutable)
- [`list-push-front!`](list/list-push-front!.md) — Prepend at front (mutable)
- [`list-pop!`](list/list-pop!.md) — Pop from end (mutable)
- [`list-pop-front!`](list/list-pop-front!.md) — Pop from front (mutable)

### Transformation

- [`list-reverse`](list/list-reverse.md) — Reverse
- [`list-to-set`](list/list-to-set.md) — Convert to set

### Iteration and mapping

- [`list-each`](list/list-each.md) — Iterate with side effects
- [`list-map`](list/list-map.md) — Map over elements
- [`list-map-zip`](list/list-map-zip.md) — Map over two lists in parallel
- [`list-zip`](list/list-zip.md) — Pair elements by position
- [`list-unzip`](list/list-unzip.md) — Unzip pairs
- [`list-select`](list/list-select.md) — Filter (keep matching)
- [`list-reject`](list/list-reject.md) — Opposite of filter (remove matching)

### Folding

- [`list-fold-left`](list/list-fold-left.md) — Left fold
- [`list-fold-right`](list/list-fold-right.md) — Right fold

### Quantification

- [`list-every?`](list/list-every?.md) — All elements satisfy predicate
- [`list-some?`](list/list-some?.md) — Some element satisfies predicate

### Sublists

- [`list-take`](list/list-take.md) — Take first n
- [`list-drop`](list/list-drop.md) — Drop first n
- [`list-append`](list/list-append.md) — Append two lists
- [`list-concat`](list/list-concat.md) — Concatenate list of lists

### Grouping and search

- [`list-group`](list/list-group.md) — Group by predicate
- [`list-find`](list/list-find.md) — Find first matching element
- [`list-find-index`](list/list-find-index.md) — Find first matching index

## Sets

Operations on `(set-t E)`.

### Type and construction

- [`set-t`](set/set-t.md) — Set type constructor
- [`make-set`](set/make-set.md) — Create set from a list

### Info

- [`set-size`](set/set-size.md) — Set size
- [`set-empty?`](set/set-empty?.md) — Check if empty
- [`set-member?`](set/set-member?.md) — Check if contains element
- [`set-subset?`](set/set-subset?.md) — Check if subset

### Mutation

- [`set-copy`](set/set-copy.md) — Copy a set
- [`set-add`](set/set-add.md) — Add element (immutable)
- [`set-add!`](set/set-add!.md) — Add element (mutable)
- [`set-delete`](set/set-delete.md) — Delete element (immutable)
- [`set-delete!`](set/set-delete!.md) — Delete element (mutable)
- [`set-clear!`](set/set-clear!.md) — Clear set (mutable)

### Set operations

- [`set-union`](set/set-union.md) — Union
- [`set-inter`](set/set-inter.md) — Intersection
- [`set-difference`](set/set-difference.md) — Difference
- [`set-disjoint?`](set/set-disjoint?.md) — Check if disjoint

### Iteration and transformation

- [`set-each`](set/set-each.md) — Iterate with side effects
- [`set-every?`](set/set-every?.md) — All elements satisfy predicate
- [`set-some?`](set/set-some?.md) — Some element satisfies predicate
- [`set-map`](set/set-map.md) — Map over elements
- [`set-select`](set/set-select.md) — Filter
- [`set-reject`](set/set-reject.md) — Opposite of filter
- [`set-to-list`](set/set-to-list.md) — Convert to list

## Hash tables

Operations on `(hash-t K V)`.

### Type and construction

- [`hash-t`](hash/hash-t.md) — Hash table type constructor
- [`make-hash`](hash/make-hash.md) — Create empty hash table
- [`hash-entry-t`](hash/hash-entry-t.md) — Entry type constructor
- [`make-hash-entry`](hash/make-hash-entry.md) — Construct an entry
- [`hash-entry-key`](hash/hash-entry-key.md) — Entry key accessor
- [`hash-entry-value`](hash/hash-entry-value.md) — Entry value accessor
- [`hash-from-entries`](hash/hash-from-entries.md) — Build hash from entry list

### Info

- [`hash-empty?`](hash/hash-empty?.md) — Check if empty
- [`hash-length`](hash/hash-length.md) — Entry count
- [`hash-has?`](hash/hash-has?.md) — Check if contains key

### Access

- [`hash-get`](hash/hash-get.md) — Get value by key
- [`hash-get-maybe`](hash/hash-get-maybe.md) — Get value as maybe

### Conversion

- [`hash-keys`](hash/hash-keys.md) — Get key list
- [`hash-values`](hash/hash-values.md) — Get value list
- [`hash-entries`](hash/hash-entries.md) — Get entry list

### Mutation

- [`hash-put`](hash/hash-put.md) — Add key-value pair (immutable)
- [`hash-put!`](hash/hash-put!.md) — Add key-value pair (mutable)
- [`hash-put-entries`](hash/hash-put-entries.md) — Put entries (immutable)
- [`hash-put-entries!`](hash/hash-put-entries!.md) — Put entries (mutable)
- [`hash-delete!`](hash/hash-delete!.md) — Delete by key (mutable)
- [`hash-copy`](hash/hash-copy.md) — Copy hash table

### Iteration

- [`hash-each`](hash/hash-each.md) — Iterate over key-value pairs
- [`hash-each-key`](hash/hash-each-key.md) — Iterate over keys
- [`hash-each-value`](hash/hash-each-value.md) — Iterate over values
- [`hash-each-entry`](hash/hash-each-entry.md) — Iterate over entries

### Mapping

- [`hash-map`](hash/hash-map.md) — Map over key-value pairs
- [`hash-map-key`](hash/hash-map-key.md) — Map over keys
- [`hash-map-value`](hash/hash-map-value.md) — Map over values
- [`hash-map-entry`](hash/hash-map-entry.md) — Map over entries

### Selection

- [`hash-select`](hash/hash-select.md) — Filter by key-value predicate
- [`hash-select-key`](hash/hash-select-key.md) — Filter by key predicate
- [`hash-select-value`](hash/hash-select-value.md) — Filter by value predicate
- [`hash-reject`](hash/hash-reject.md) — Remove by key-value predicate
- [`hash-reject-key`](hash/hash-reject-key.md) — Remove by key predicate
- [`hash-reject-value`](hash/hash-reject-value.md) — Remove by value predicate

### Aggregation

- [`hash-append`](hash/hash-append.md) — Merge two hash tables
- [`hash-invert`](hash/hash-invert.md) — Swap keys and values
- [`hash-invert-group`](hash/hash-invert-group.md) — Invert with value grouping

## Pair

Operations on `(pair-t A B)`.

- [`pair-t`](pair/pair-t.md) — Pair type constructor
- [`make-pair`](pair/make-pair.md) — Construct a pair
- [`pair?`](pair/pair?.md) — Check if a value is a pair
- [`pair-first`](pair/pair-first.md) — First element
- [`pair-second`](pair/pair-second.md) — Second element
- [`pair-put-first!`](pair/pair-put-first!.md) — Replace first element
- [`pair-put-second!`](pair/pair-put-second!.md) — Replace second element

## Maybe

Operations on `(maybe-t A)`.

- [`maybe-t`](maybe/maybe-t.md) — Maybe type constructor
- [`just`](maybe/just.md) — Construct a present value
- [`nothing`](maybe/nothing.md) — Represent a missing value
- [`just?`](maybe/just?.md) — Check if just
- [`nothing?`](maybe/nothing?.md) — Check if nothing
- [`just-value`](maybe/just-value.md) — Extract value from just
- [`just-put-value!`](maybe/just-put-value!.md) — Replace value in just

## Box

Operations on the opaque type `(box-t E)`.

- [`box-t`](box/box-t.md) — Box type constructor
- [`make-box`](box/make-box.md) — Create an empty box
- [`box-empty?`](box/box-empty?.md) — Check if empty
- [`box-put!`](box/box-put!.md) — Store a value
- [`box-get-maybe`](box/box-get-maybe.md) — Get value as maybe
- [`box-get`](box/box-get.md) — Get value (error if empty)

## Function operations

Higher-order function manipulation.

- [`constant`](function/constant.md) — Return first argument
- [`identity`](function/identity.md) — Return argument unchanged
- [`swap`](function/swap.md) — Swap function arguments
- [`drop`](function/drop.md) — Ignore first argument
- [`dup`](function/dup.md) — Duplicate argument

## File I/O

File handle read/write operations.

### Type

- [`file-t`](file/file-t.md) — File handle type

### Open and close

- [`open-input-file`](file/open-input-file.md) — Open file for reading
- [`open-output-file`](file/open-output-file.md) — Open file for writing
- [`file-close`](file/file-close.md) — Close file

### Read and write

- [`file-read`](file/file-read.md) — Read entire file
- [`file-write`](file/file-write.md) — Write a string
- [`file-writeln`](file/file-writeln.md) — Write a string with newline

### Convenience

- [`call-with-input-file`](file/call-with-input-file.md) — Auto-closing read
- [`call-with-output-file`](file/call-with-output-file.md) — Auto-closing write

### Standard output

- [`print`](file/print.md) — Print any value
- [`println`](file/println.md) — Print any value with newline
- [`write`](file/write.md) — Write a string
- [`writeln`](file/writeln.md) — Write a string with newline
- [`newline`](file/newline.md) — Print a newline
- [`current-stdout-file`](file/current-stdout-file.md) — Get current stdout file handle
- [`current-stderr-file`](file/current-stderr-file.md) — Get current stderr file handle

## File system

Functions that operate directly on the file system.

### Query

- [`fs-exists?`](fs/fs-exists?.md) — Check if path exists
- [`fs-file?`](fs/fs-file?.md) — Check if path is a file
- [`fs-directory?`](fs/fs-directory?.md) — Check if path is a directory

### Read and write

- [`fs-read`](fs/fs-read.md) — Read file
- [`fs-write`](fs/fs-write.md) — Write file

### Directory operations

- [`fs-list`](fs/fs-list.md) — List directory contents
- [`fs-list-recursive`](fs/fs-list-recursive.md) — List directory recursively
- [`fs-ensure-file`](fs/fs-ensure-file.md) — Ensure file exists
- [`fs-ensure-directory`](fs/fs-ensure-directory.md) — Ensure directory exists

### Delete and rename

- [`fs-delete-file`](fs/fs-delete-file.md) — Delete file
- [`fs-delete-directory`](fs/fs-delete-directory.md) — Delete empty directory
- [`fs-delete`](fs/fs-delete.md) — Delete recursively
- [`fs-rename`](fs/fs-rename.md) — Rename

## Path operations

Path string manipulation functions.

- [`path-base-name`](path/path-base-name.md) — Get file name
- [`path-directory-name`](path/path-directory-name.md) — Get directory name
- [`path-extension`](path/path-extension.md) — Get file extension
- [`path-stem`](path/path-stem.md) — Get file stem
- [`path-absolute?`](path/path-absolute?.md) — Check if absolute
- [`path-relative?`](path/path-relative?.md) — Check if relative
- [`path-join`](path/path-join.md) — Join paths
- [`path-normalize`](path/path-normalize.md) — Normalize path

## Assertions

Assertion functions for testing.

- [`assert`](assert/assert.md) — Assert condition is true
- [`assert-not`](assert/assert-not.md) — Assert condition is false
- [`assert-equal`](assert/assert-equal.md) — Assert two values are equal
- [`assert-not-equal`](assert/assert-not-equal.md) — Assert two values are not equal

## Error handling

- [`error`](error/error.md) — Throw an error

## Process

- [`exit`](process/exit.md) — Exit with a code
- [`current-directory`](process/current-directory.md) — Get current directory

## Random

- [`random-int`](random/random-int.md) — Random integer
- [`random-float`](random/random-float.md) — Random float

## S-expressions

S-expression parsing, formatting, and related types.

### Types

- [`located-sexp-t`](sexp/located-sexp-t.md) — Located S-expression type
- [`source-location-t`](sexp/source-location-t.md) — Source location type
- [`source-span-t`](sexp/source-span-t.md) — Source span type
- [`source-position-t`](sexp/source-position-t.md) — Source position type

### Operations

- [`parse-located-sexps`](sexp/parse-located-sexps.md) — Parse to located S-expressions
- [`format-sexp`](sexp/format-sexp.md) — Format an S-expression
- [`sexp-collect-key-value-pairs`](sexp/sexp-collect-key-value-pairs.md) — Collect key-value pairs as a list
- [`sexp-collect-key-value-hash`](sexp/sexp-collect-key-value-hash.md) — Collect key-value pairs as a hash

## Type

- [`type-t`](type/type-t.md) — The type of types
