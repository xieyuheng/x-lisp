#include "index.h"

int
main(void) {
    test_start();

    assert(string_equal("abc", "abc"));
    assert(!string_equal("abc", "abd"));

    char *abc = string_copy("abc");
    assert(string_equal("abc", abc));

    assert(string_length("") == 0);
    assert(string_length("1") == 1);
    assert(string_length("12") == 2);
    assert(string_length("123") == 3);

    string_free(abc);

    {
        assert(string_is_int_with_base("123", 10));
        assert(string_is_int_with_base("-123", 10));

        assert(!string_is_int_with_base("123", 3));
        assert(!string_is_int_with_base("-123", 3));
    }

    {
        assert(string_is_int("123"));
        assert(string_is_int("-123"));
        assert(string_is_int("+123"));
        assert(!string_is_int("a123"));
        assert(!string_is_int("123a"));

        assert(!string_is_int("0x123z"));
        assert(string_is_int("0x123a"));
        assert(string_is_int("0x123A"));
        assert(string_is_int("-0x123a"));
        assert(!string_is_int("--0x123A"));

        // 0b is only supported after c23.
        assert(string_is_int("0b10"));

        // 0o is not handled by c.
        assert(!string_is_int("0o10"));
    }

    {
        assert(string_parse_int_with_base("", 10) == 0);
        assert(string_parse_int_with_base("-", 10) == 0);
        assert(string_parse_int_with_base("-1", 10) == -1);
        assert(string_parse_int_with_base("123", 10) == 123);
        assert(string_parse_int_with_base("+123", 10) == 123);
        assert(string_parse_int_with_base("-123", 10) == -123);

        assert(string_parse_int_with_base("10", 16) == 16);
        assert(string_parse_int_with_base("+10", 16) == 16);
        assert(string_parse_int_with_base("-10", 16) == -16);

        assert(string_parse_int_with_base("0x10", 16) == 16);
        assert(string_parse_int_with_base("+0x10", 16) == 16);
        assert(string_parse_int_with_base("-0x10", 16) == -16);

        // 0o prefix is not supported.
        assert(string_parse_int_with_base("010", 8) == 8);
        assert(string_parse_int_with_base("-010", 8) == -8);

        assert(string_parse_int_with_base("10", 8) == 8);
        assert(string_parse_int_with_base("-10", 8) == -8);

        assert(string_parse_int_with_base("10", 2) == 2);
        assert(string_parse_int_with_base("-10", 2) == -2);

        assert(string_parse_int_with_base("0b10", 2) == 2);
        assert(string_parse_int_with_base("-0b10", 2) == -2);
    }

    {
        assert(string_parse_int("") == 0);
        assert(string_parse_int("-") == 0);
        assert(string_parse_int("-1") == -1);
        assert(string_parse_int("123") == 123);
        assert(string_parse_int("+123") == 123);
        assert(string_parse_int("-123") == -123);

        assert(string_parse_int("0x10") == 16);
        assert(string_parse_int("+0x10") == 16);
        assert(string_parse_int("-0x10") == -16);

        // 0o prefix is not supported.
        assert(string_parse_int("010") == 8);
        assert(string_parse_int("-010") == -8);

        assert(string_parse_int("0b10") == 2);
        assert(string_parse_int("-0b10") == -2);
    }

    {
        assert(string_parse_uint_with_base("", 16) == 0);
        assert(string_parse_uint_with_base("f", 16) == 15);
        assert(string_parse_uint_with_base("F", 16) == 15);
        assert(string_parse_uint_with_base("ff", 16) == 255);
        assert(string_parse_uint_with_base("FF", 16) == 255);
        assert(string_parse_uint_with_base("FF:123", 16) == 255);
    }

    {
        assert(string_parse_uint("0x0") == 0);
        assert(string_parse_uint("0xf") == 15);
        assert(string_parse_uint("0xF") == 15);
        assert(string_parse_uint("0xff") == 255);
        assert(string_parse_uint("0xFF") == 255);
        assert(string_parse_uint("0xFF:123") == 255);
    }

    char *abc123 = string_append("abc", "123");
    assert(string_equal(abc123, "abc123"));

    assert(string_starts_with(abc123, "abc"));
    assert(string_ends_with(abc123, "123"));

    assert(string_equal(string_slice("01234", 2, 4), "23"));

    assert(string_find_index("01234", '0') == 0);
    assert(string_find_index("01234", '1') == 1);
    assert(string_find_index("01234", '2') == 2);
    assert(string_find_index("01234", '5') == -1);
    assert(string_find_index("", '5') == -1);
    assert(string_find_index("", '\0') == 0);

    assert(string_count_char("0aaa0", 'b') == 0);
    assert(string_count_char("0aaa0", 'a') == 3);
    assert(string_count_char("0aaa0", '0') == 2);

    assert(!string_has_char("0aaa0", 'b'));
    assert(string_has_char("0aaa0", 'a'));
    assert(string_has_char("0aaa0", '0'));

    assert(string_count_substring("0aaa0", "a") == 3);
    assert(string_count_substring("0aaa0", "aa") == 2);
    assert(string_count_substring("0aaa0", "aaa") == 1);
    assert(string_count_substring("0aaa0aaa", "aa") == 4);
    assert(string_count_substring("0aaa0aaa", "aaa") == 2);

    assert(string_equal(string_to_lower_case("ABC"), "abc"));
    assert(string_equal(string_to_upper_case("abc"), "ABC"));

    assert(string_equal_mod_case("ABC", "abc"));
    assert(string_equal_mod_case("abc", "ABC"));

    {
        assert(string_is_double("0"));
        assert(string_is_double("0.1"));
        assert(string_is_double(".1"));
        assert(string_is_double("0.0"));

        assert(string_is_double("+0"));
        assert(string_is_double("+0.1"));
        assert(string_is_double("+.1"));
        assert(string_is_double("+0.0"));

        assert(string_is_double("-0"));
        assert(string_is_double("-0.1"));
        assert(string_is_double("-.1"));
        assert(string_is_double("-0.0"));
    }

    {
        assert(string_parse_double("0") == 0);
        assert(string_parse_double("0.1") == 0.1);
        assert(string_parse_double(".1") == 0.1);
        assert(string_parse_double("0.0") == 0);

        assert(string_parse_double("+0") == 0);
        assert(string_parse_double("+0.1") == 0.1);
        assert(string_parse_double("+.1") == 0.1);
        assert(string_parse_double("+0.0") == 0);

        assert(string_parse_double("-0") == 0);
        assert(string_parse_double("-0.1") == -0.1);
        assert(string_parse_double("-.1") == -0.1);
        assert(string_parse_double("-0.0") == 0);
    }

    {
        const char *string = "";
        size_t cursor = 0;
        assert(string_next_word(string, &cursor) == NULL);
        assert(string_next_word(string, &cursor) == NULL);
        assert(string_next_word(string, &cursor) == NULL);
    }

    {
        const char *string = "  \n  \t  ";
        size_t cursor = 0;
        assert(string_next_word(string, &cursor) == NULL);
        assert(string_next_word(string, &cursor) == NULL);
        assert(string_next_word(string, &cursor) == NULL);
    }

    {
        const char *string = " abc 123 ";
        size_t cursor = 0;
        assert(string_equal(string_next_word(string, &cursor), "abc"));
        assert(string_equal(string_next_word(string, &cursor), "123"));
        assert(string_next_word(string, &cursor) == NULL);
        assert(string_next_word(string, &cursor) == NULL);
        assert(string_next_word(string, &cursor) == NULL);
    }

    {
        const char *string = " abc 123 ";
        size_t cursor = 0;
        assert(string_equal(string_next_word(string, &cursor), "abc"));
        assert(string_equal(string_next_word(string, &cursor), "123"));
        assert(string_next_word(string, &cursor) == NULL);
        assert(string_next_word(string, &cursor) == NULL);
        assert(string_next_word(string, &cursor) == NULL);
    }

    {
        const char *string =
            "123\n"
            "456\n"
            "789\n";
        size_t cursor = 0;
        assert(string_equal(string_next_line(string, &cursor), "123"));
        assert(string_equal(string_next_line(string, &cursor), "456"));
        assert(string_equal(string_next_line(string, &cursor), "789"));
        assert(string_next_line(string, &cursor) == NULL);
        assert(string_next_line(string, &cursor) == NULL);
        assert(string_next_line(string, &cursor) == NULL);
    }

    {
        const char *string =
            "123\n"
            "\n"
            "789\n";
        size_t cursor = 0;
        assert(string_equal(string_next_line(string, &cursor), "123"));
        assert(string_equal(string_next_line(string, &cursor), ""));
        assert(string_equal(string_next_line(string, &cursor), "789"));
        assert(string_next_line(string, &cursor) == NULL);
        assert(string_next_line(string, &cursor) == NULL);
        assert(string_next_line(string, &cursor) == NULL);
    }

    {
        const char *string =
            "123\n"
            "456\n"
            "789"; // no ending newline
        size_t cursor = 0;
        assert(string_equal(string_next_line(string, &cursor), "123"));
        assert(string_equal(string_next_line(string, &cursor), "456"));
        assert(string_equal(string_next_line(string, &cursor), "789"));
        assert(string_next_line(string, &cursor) == NULL);
        assert(string_next_line(string, &cursor) == NULL);
        assert(string_next_line(string, &cursor) == NULL);
    }

    test_end();
}
