cc = gcc

cflags = -std=c23
cflags += -g
cflags += -O3
cflags += -I/usr/local/include
cflags += -Wall
cflags += -Wwrite-strings
cflags += -Wextra
cflags += -Werror
cflags += -Wpedantic
cflags += -D_POSIX_C_SOURCE=200809L
cflags += -D_TIME_BITS=64
cflags += -D_FILE_OFFSET_BITS=64
cflags += $(CFLAGS)

ldflags = -L/usr/local/lib
ldflags += -lm -pthread
ldflags += $(LDFLAGS)

ifeq ($(TSAN), true)
ldflags += -fsanitize=thread
cflags += -fsanitize=thread
endif

ifeq ($(STATIC), true)
ldflags += -static
endif

sources = $(shell find src -name '*.c' -not -name '*.test.c' -not -name '*.snapshot.c' -not -name '*.exe.c')
objects = $(patsubst %.c, %.o, $(sources))
headers = $(shell find src -name '*.h')

test_sources = $(shell find src -name '*.test.c')
tests = $(patsubst %.c, %, $(test_sources))

snapshot_sources = $(shell find src -name '*.snapshot.c')
snapshots = $(patsubst %.c, %, $(snapshot_sources))

parallel = parallel -v --halt now,fail=1

.PHONY: all test snapshot clean

all: test snapshot

test: $(tests)
	echo $(tests) | tr [:space:] '\n' | $(parallel) {}

snapshot: $(snapshots)
	echo $(snapshots) | tr [:space:] '\n' | $(parallel) {} ">" {}.out

src/%.test: src/%.test.c src/index.a
	$(cc) $(cflags) $(ldflags) $^ -o $@

src/%.snapshot: src/%.snapshot.c src/index.a
	$(cc) $(cflags) $(ldflags) $^ -o $@

src/index.a: $(objects)
	ar rcs $@ $^

src/%.o: src/%.c $(headers)
	$(cc) -c $(cflags) $< -o $@

clean:
	rm -rf $(objects) $(tests) $(snapshots) src/index.a
