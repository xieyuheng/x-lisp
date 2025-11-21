# x-sexp.js

An extension to [S-expression](https://en.wikipedia.org/wiki/S-expression)
to support list with attributes.

For example, we can represent the following XML:

```xml
<bookstore>
  <book id="b101" category="fiction" lang="en">
    <title>The Great Novel</title>
    <author>Bill Authorette</author>
    <year>2021</year>
    <price currency="USD">24.99</price>
  </book>
  <book id="b102" category="non-fiction" lang="fr">
    <title>Learning XML</title>
    <author>Pierre Document</author>
    <year>2019</year>
    <price currency="EUR">19.50</price>
  </book>
</bookstore>
```

as:

```clojure
(bookstore
 (book :id b101 :category fiction :lang en
  (title "The Great Novel")
  (author "Bill Authorette")
  (year 2021)
  (price :currency USD 24.99))
 (book :id b102 :category non-fiction :lang fr
  (title "Learning XML")
  (author "Pierre Document")
  (year 2019)
  (price :currency EUR 19.50)))
```

which evaluates to:

```clojure
['bookstore
 ['book :id 'b101 :category 'fiction :lang 'en
  ['title "The Great Novel"]
  ['author "Bill Authorette"]
  ['year 2021]
  ['price 24.99 :currency 'USD]]
 ['book :id 'b102 :category 'non-fiction :lang 'fr
  ['title "Learning XML"]
  ['author "Pierre Document"]
  ['year 2019]
  ['price 19.5 :currency 'EUR]]]
```

## Examples

- [src/examples/lambda.test.ts](src/examples/lambda.test.ts):
- [src/examples/tau.test.ts](src/examples/tau.test.ts):

## References

- [Some Thoughts on JSON vs S-expressions](https://eli.thegreenplace.net/2012/03/04/some-thoughts-on-json-vs-s-expressions), by Eli Bendersky, 2012.
- [with-meta in clojure.core](https://clojuredocs.org/clojure.core/with-meta)
