#include "index.h"

int
main(void) {
    test_start();

    {
        list_t *tokens = lex(NULL, "");
        assert(list_length(tokens) == 0);
        list_free(tokens);
    }

    {
        list_t *tokens = lex(NULL, " ");
        assert(list_length(tokens) == 0);
        list_free(tokens);
    }

    {
        list_t *tokens = lex(NULL, " \n \t \n ");
        assert(list_length(tokens) == 0);
        list_free(tokens);
    }

    {
        list_t *tokens = lex(NULL, "()");
        assert(list_length(tokens) == 2);

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == BRACKET_START_TOKEN);
            assert(string_equal(token->content, "("));
            token_free(token);
        }

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == BRACKET_END_TOKEN);
            assert(string_equal(token->content, ")"));
            token_free(token);
        }

        list_free(tokens);
    }

    {
        list_t *tokens = lex(NULL, "a b c");
        assert(list_length(tokens) == 3);

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == SYMBOL_TOKEN);
            assert(string_equal(token->content, "a"));
            token_free(token);
        }

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == SYMBOL_TOKEN);
            assert(string_equal(token->content, "b"));
            token_free(token);
        }

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == SYMBOL_TOKEN);
            assert(string_equal(token->content, "c"));
            token_free(token);
        }

        list_free(tokens);
    }

    {
        list_t *tokens = lex(NULL, "(a)");
        assert(list_length(tokens) == 3);

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == BRACKET_START_TOKEN);
            assert(string_equal(token->content, "("));
            token_free(token);
        }

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == SYMBOL_TOKEN);
            assert(string_equal(token->content, "a"));
            token_free(token);
        }

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == BRACKET_END_TOKEN);
            assert(string_equal(token->content, ")"));
            token_free(token);
        }

        list_free(tokens);
    }

    {
        list_t *tokens = lex(NULL, "a :b #c");
        assert(list_length(tokens) == 3);

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == SYMBOL_TOKEN);
            assert(string_equal(token->content, "a"));
            token_free(token);
        }

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == KEYWORD_TOKEN);
            assert(string_equal(token->content, "b"));
            token_free(token);
        }

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == HASHTAG_TOKEN);
            assert(string_equal(token->content, "c"));
            token_free(token);
        }

        list_free(tokens);
    }

    {
        list_t *tokens = lex(NULL, ": #");
        assert(list_length(tokens) == 2);

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == SYMBOL_TOKEN);
            assert(string_equal(token->content, ":"));
            token_free(token);
        }

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == SYMBOL_TOKEN);
            assert(string_equal(token->content, "#"));
            token_free(token);
        }

        list_free(tokens);
    }

    {
        list_t *tokens = lex(NULL, "1 0 -1");
        assert(list_length(tokens) == 3);

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == INT_TOKEN);
            assert(string_equal(token->content, "1"));
            token_free(token);
        }

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == INT_TOKEN);
            assert(string_equal(token->content, "0"));
            token_free(token);
        }

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == INT_TOKEN);
            assert(string_equal(token->content, "-1"));
            token_free(token);
        }

        list_free(tokens);
    }

    {
        list_t *tokens = lex(NULL, "1.0 0.0 -1.0");
        assert(list_length(tokens) == 3);

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == FLOAT_TOKEN);
            assert(string_equal(token->content, "1.0"));
            token_free(token);
        }

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == FLOAT_TOKEN);
            assert(string_equal(token->content, "0.0"));
            token_free(token);
        }

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == FLOAT_TOKEN);
            assert(string_equal(token->content, "-1.0"));
            token_free(token);
        }

        list_free(tokens);
    }

    {
        list_t *tokens = lex(NULL, "\"a\" \"b\" \"\\n\"");
        assert(list_length(tokens) == 3);

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == STRING_TOKEN);
            assert(string_equal(token->content, "a"));
            token_free(token);
        }

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == STRING_TOKEN);
            assert(string_equal(token->content, "b"));
            token_free(token);
        }

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == STRING_TOKEN);
            assert(string_equal(token->content, "\n"));
            token_free(token);
        }

        list_free(tokens);
    }

    {
        list_t *tokens = lex(NULL, "a b -- comment\n c");
        assert(list_length(tokens) == 4);

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == SYMBOL_TOKEN);
            assert(string_equal(token->content, "a"));
            token_free(token);
        }

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == SYMBOL_TOKEN);
            assert(string_equal(token->content, "b"));
            token_free(token);
        }

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == LINE_COMMENT_TOKEN);
            assert(string_equal(token->content, "-- comment"));
            token_free(token);
        }

        {
            token_t *token = list_shift(tokens);
            assert(token->kind == SYMBOL_TOKEN);
            assert(string_equal(token->content, "c"));
            token_free(token);
        }

        list_free(tokens);
    }

    test_end();
}
