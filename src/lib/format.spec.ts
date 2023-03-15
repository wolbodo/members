import { expect, it } from "vitest";
import { datetime, formatDate } from "./format";

const date = ''

it.each`
  date  | expected
  ${'2000-10-15T12:34:56.789Z'} | ${'15-10-2000 14:34'}
  ${'2222-11-30'} | ${'30-11-2222 00:00'}
`('datetime returns $expected when $date is passed',
  ({ date, expected }) => {
    expect(datetime(date)).toBe(expected)
  }
)

it.each`
  date  | expected
  ${'2000-10-15T12:34:56.789Z'} | ${'15-10-2000'}
  ${'2222-11-30'} | ${'30-11-2222'}
`('formatDat returns $expected when $date is passed',
  ({ date, expected }) => {
    expect(formatDate(date)).toBe(expected)
  }
)
