cc = gcc

cflags = -std=c23
cflags += -g
cflags += -O3
cflags += -falign-functions=8
cflags += -funsigned-char
cflags += -fno-omit-frame-pointer
cflags += -flto
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
ldflags += -flto
ldflags += -lm 
ldflags += -pthread
ldflags += $(LDFLAGS)

ifdef TSAN
ldflags += -fsanitize=thread
cflags += -fsanitize=thread
endif

STATIC = 1
ifdef STATIC
ldflags += -static
endif

sources = $(shell find src -name '*.c' -not -name '*.test.c' -not -name '*.snapshot.c' -not -name '*.exe.c')
objects = $(patsubst %.c, %.o, $(sources))
headers = $(shell find src -name '*.h')

test_sources = $(shell find src -name '*.test.c')
tests = $(patsubst %.c, %, $(test_sources))

snapshot_sources = $(shell find src -name '*.snapshot.c')
snapshots = $(patsubst %.c, %, $(snapshot_sources))

exe_sources = $(shell find src -name '*.exe.c')
exes = $(patsubst %.c, %, $(exe_sources))

parallel = parallel -v --halt now,fail=1

deps =

.PHONY: all test clean

all: $(exes) $(tests) $(snapshots)

test: $(tests) $(snapshots)
	echo $(tests) | tr [:space:] '\n' | $(parallel) {}
#	echo $(snapshots) | tr [:space:] '\n' | $(parallel) {} ">" {}.out

src/%.exe: src/%.exe.c src/index.po
	$(cc) $(cflags) $^ $(deps) $(ldflags) -o $@

src/%.test: src/%.test.c src/index.po
	$(cc) $(cflags) $^ $(deps) $(ldflags) -o $@

src/%.snapshot: src/%.snapshot.c src/index.po
	$(cc) $(cflags) $^ $(deps) $(ldflags) -o $@

src/index.po: $(objects)
	ld -r $^ -o $@

src/%.o: src/%.c $(headers)
	$(cc) -c $(cflags) $< -o $@

clean:
	rm -rf $(objects) $(exes) $(tests) $(snapshots) src/index.po
