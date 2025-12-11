include ../../.make/c.mk

deps = ../helpers.c/src/index.o

build:: bin/runtime.o bin/bundle

bin/bundle: bin/runtime.o bin/bundle.o
	$(cc) $^ $(ldflags) -o $@

bin/bundle.o: bin/bundle.c
	$(cc) -r $(cflags) $^ -o bin/bundle.o

bin/runtime.o: bin/runtime.c src/index.o
	$(cc) -r $(cflags) $^ $(deps) -o bin/runtime.o

clean::
	rm -rf bin/*.o bin/bundle
