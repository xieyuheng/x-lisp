# helpers.c

My [scalable c](https://github.com/booksbyus/scalable-c) inspired helper modules for C.

## development

```shell
make -j
make run
make test
make clean
```

Using [tsan (ThreadSanitizer)](https://github.com/google/sanitizers/wiki/threadsanitizercppmanual)
to test data race in parallel program:

```shell
make clean && TSAN=true make -j
```
