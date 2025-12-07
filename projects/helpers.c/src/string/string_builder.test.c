#include "index.h"

int
main(void) {
    test_start();

    string_builder_t *builder = make_string_builder();

    assert(string_equal("", string_builder_produce(builder)));
    string_builder_append_char(builder, 'a');
    assert(string_equal("a", string_builder_produce(builder)));
    string_builder_append_char(builder, 'b');
    assert(string_equal("ab", string_builder_produce(builder)));
    string_builder_append_char(builder, 'c');
    assert(string_equal("abc", string_builder_produce(builder)));

    string_builder_clear(builder);
    assert(string_equal("", string_builder_produce(builder)));
    string_builder_append_string(builder, "abc");
    assert(string_equal("abc", string_builder_produce(builder)));

    string_builder_free(builder);

    test_end();
}
