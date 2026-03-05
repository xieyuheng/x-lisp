import { type Consumer } from "../Consumer.ts"
import { BracketEndConsumer } from "./BracketEndConsumer.ts"
import { BracketStartConsumer } from "./BracketStartConsumer.ts"
import { CommentConsumer } from "./CommentConsumer.ts"
import { HashtagConsumer } from "./HashtagConsumer.ts"
import { KeywordConsumer } from "./KeywordConsumer.ts"
import { NumberConsumer } from "./NumberConsumer.ts"
import { QuoteConsumer } from "./QuoteConsumer.ts"
import { SpaceConsumer } from "./SpaceConsumer.ts"
import { StringConsumer } from "./StringConsumer.ts"
import { SymbolConsumer } from "./SymbolConsumer.ts"

export function useConsumers(): Array<Consumer> {
  return [
    // The order matters.
    new SpaceConsumer(),
    new QuoteConsumer(),
    new BracketStartConsumer(),
    new BracketEndConsumer(),
    new CommentConsumer(),
    new StringConsumer(),
    new NumberConsumer(),
    new KeywordConsumer(),
    new HashtagConsumer(),
    new SymbolConsumer(),
  ]
}
