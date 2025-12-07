#include "index.h"

struct consumer_t consumers[] = {
    // The order matters.
    {
        .is_ignored = true,
        .can_consume = can_consume_space,
        .consume = consume_space,
    },
    {
        .kind = QUOTATION_MARK_TOKEN,
        .can_consume = can_consume_quotation_mark,
        .consume = consume_quotation_mark,
    },
    {
        .kind = BRACKET_START_TOKEN,
        .can_consume = can_consume_bracket_start,
        .consume = consume_bracket_start,
    },
    {
        .kind = BRACKET_END_TOKEN,
        .can_consume = can_consume_bracket_end,
        .consume = consume_bracket_end,
    },
    // {
    //     .kind = LINE_COMMENT_TOKEN,
    //     .can_consume = can_consume_line_comment,
    //     .consume = consume_line_comment,
    // },
    {
        .kind = STRING_TOKEN,
        .can_consume = can_consume_string,
        .consume = consume_string,
    },
    {
        .kind = INT_TOKEN,
        .can_consume = can_consume_int,
        .consume = consume_int,
    },
    {
        .kind = FLOAT_TOKEN,
        .can_consume = can_consume_float,
        .consume = consume_float,
    },
    {
        .kind = KEYWORD_TOKEN,
        .can_consume = can_consume_keyword,
        .consume = consume_keyword,
    },
    {
        .kind = HASHTAG_TOKEN,
        .can_consume = can_consume_hashtag,
        .consume = consume_hashtag,
    },
    {
        .kind = SYMBOL_TOKEN,
        .can_consume = can_consume_symbol,
        .consume = consume_symbol,
    },
};

size_t
consumer_count(void) {
    return sizeof(consumers) / sizeof(consumers[0]);
}
