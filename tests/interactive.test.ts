import assert from "node:assert/strict";
import test from "node:test";
import data from "../src/data/etfs.json" with { type: "json" };
import {
  annualFundCost,
  parseAmount,
  formatCurrency,
  MAX_AMOUNT,
} from "../src/utils/costs.ts";
import { quizQuestions, summarizeQuiz } from "../src/data/quiz.ts";

test("Current sourced fund fees yield the independently calculated crown costs", () => {
  const expected = { VOO: [3, 30, 300], VTI: [3, 30, 300], SCHD: [6, 60, 600] };
  for (const fund of data.funds) {
    [10_000, 100_000, 1_000_000].forEach((amount, i) =>
      assert.ok(
        Math.abs(
          annualFundCost(amount, fund.expenseRatioPercent) -
            expected[fund.ticker][i],
        ) < 1e-9,
      ),
    );
    assert.equal(annualFundCost(0, fund.expenseRatioPercent), 0);
    assert.ok(
      data.sources.some((source) => source.id === fund.expenseRatioSourceId),
    );
  }
  assert.ok(
    Math.abs(
      annualFundCost(100_000, 0.06) - annualFundCost(100_000, 0.03) - 30,
    ) < 1e-9,
  );
  assert.ok(Math.abs(annualFundCost(100_000.5, 0.03) - 30.00015) < 1e-9);
});

test("Czech input accepts grouping, decimals and zero; rejects malformed or out-of-range values", () => {
  for (const text of [
    "100 000,50",
    "100000.50",
    "100\u00a0000,50",
    "100\u202f000,50",
  ])
    assert.equal(parseAmount(text).value, 100_000.5);
  assert.equal(parseAmount("0").value, 0);
  assert.equal(parseAmount(String(MAX_AMOUNT)).value, MAX_AMOUNT);
  for (const text of [
    "",
    " ",
    "-1",
    "abc",
    "1e5",
    "Infinity",
    "1 2 3",
    "1,000.50",
    "2.333",
    "1000000001",
    "9".repeat(100),
  ]) {
    assert.equal(parseAmount(text).value, null, text);
    assert.ok(parseAmount(text).error);
  }
  for (const amount of [-1, Infinity, NaN, MAX_AMOUNT + 1])
    assert.throws(() => annualFundCost(amount, 0.03), RangeError);
  for (const fee of [-1, Infinity, NaN, 101])
    assert.throws(() => annualFundCost(100_000, fee), RangeError);
  assert.equal(formatCurrency(0.0003), "0,00\u00a0Kč");
  assert.equal(formatCurrency(30), "30,00\u00a0Kč");
});

test("Quiz scores every answer combination and keeps feedback topics consistent", () => {
  const answerKeys = ["no", "no", "no"];
  quizQuestions.forEach((q, i) => {
    assert.equal(q.correctId, answerKeys[i]);
    assert.equal(
      q.options.filter((option) => option.id === q.correctId).length,
      1,
    );
    q.sourceIds.forEach((id) =>
      assert.ok(data.sources.some((s) => s.id === id)),
    );
  });
  for (let mask = 0; mask < 8; mask++) {
    const answers = Object.fromEntries(
      quizQuestions.map((q, i) => [q.id, mask & (1 << i) ? "no" : "yes"]),
    );
    const expected = [0, 1, 2].filter((i) => mask & (1 << i)).length;
    const summary = summarizeQuiz(answers);
    assert.equal(summary.score, expected);
    assert.equal(summary.review.length, 3 - expected);
    assert.equal(summary.complete, true);
  }
  assert.equal(summarizeQuiz({}).complete, false);
  assert.equal(
    summarizeQuiz({ strategy: "invalid", costs: "no", risk: "no" }).complete,
    false,
  );
});
