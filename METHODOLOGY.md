# Methodology

How prices in `pricing.json` get from a vendor's marketing page to a number you can trust.

## What we publish

For each model: input price, output price, context window, vendor, tier, and an optional editorial note. All prices are in USD per 1 million tokens.

We don't publish: cached-input pricing, batch pricing, fine-tuning prices, image/audio modality pricing. Those are real but they vary too much by use case to compress into one number. If you need them, the vendor's docs are the right source.

## The daily audit

Every day, an automated script:

1. Cross-references each model's pricing against vendor sources and industry catalog aggregators.
2. Diffs the result against the values currently in `pricing.json`.
3. Splits any drift into two buckets:
   - **Small drift** (under 25% on both input and output, no sign mismatch, non-zero prices) — auto-applied and committed the same day. The dataset's `verifiedDate` advances. The change appears in `pricing.json` within a few minutes of detection.
   - **Larger drift** — opens a GitHub issue. A human verifies against the vendor page, decides whether to apply, and merges.

The thresholds exist because typical vendor adjustments are 0–20%. A 25%+ change is rare and usually indicates a tier consolidation, model rename, deprecation, or aggregator data error worth a human eye.

## Why a human is still in the loop

Auto-apply handles the routine case — small competitive adjustments, gradual cuts. Vendors also do less routine things: rename models mid-life, consolidate tiers, deprecate older versions, or correct their own pricing-page errors. Those land in the human review queue.

A few real edge cases the human review has caught: a vendor pricing page accidentally showed per-token pricing in scientific notation (would have flagged $1,250 per million); an aggregator briefly cached an old struck-through SEO price; a model rename that looked like a pricing change because the slug pointed at a different SKU.

If a large change is pending review, the audit issue stays open and the JSON stays at the previous verified value. The `verifiedDate` field tells you when the dataset was last confirmed end-to-end.

## What "tier" means

The tier field is editorial — our judgment, not the vendor's marketing.

- **frontier** — best-in-class reasoning. Use for the hardest decisions in a workflow.
- **balanced** — handles ~90% of agent work at a fraction of frontier cost. The default choice.
- **value** — fast and cheap. Use for high-volume mechanical work (parsing, classification, simple replies).
- **open** — open-weight models, typically served by inference providers like Together AI or Fireworks. Pricing reflects the cheapest reliable host we've measured.

Tier is the field most likely to change without a price changing. If a model gets meaningfully better via a point release, it might move from `balanced` to `frontier`.

## What we won't do

- **No vendor influence.** Vendors don't get a say in tier assignments, notes, or whether their model is included.
- **No paid placement.** Nothing in this dataset is sponsored.
- **No silent breaking changes.** `slug` values are stable. If a model is deprecated, it stays in the dataset with a `notes` field saying so until at least 90 days after the vendor's deprecation date.

## Errors

Found a price that's wrong? [Open an issue](https://github.com/lucaspowell8020/ai-agent-pricing/issues) with the vendor URL and the value you'd expect. We'll fix it and credit you in the changelog.

If the dataset goes more than 9 days without a `verifiedDate` update, the audit pipeline is broken — please open an issue.
