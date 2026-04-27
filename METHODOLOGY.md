# Methodology

How prices in `pricing.json` get from a vendor's marketing page to a number you can trust.

## What we publish

For each model: input price, output price, context window, vendor, tier, and an optional editorial note. All prices are in USD per 1 million tokens.

We don't publish: cached-input pricing, batch pricing, fine-tuning prices, image/audio modality pricing. Those are real but they vary too much by use case to compress into one number. If you need them, the vendor's docs are the right source.

## The weekly audit

Every week, an automated script:

1. Fetches each vendor's pricing page (Anthropic, OpenAI, Google, Together AI, DeepSeek, etc.).
2. Sends the relevant HTML to a small LLM with a structured-output prompt that returns `rawInputPrice`, `rawOutputPrice`, `rawUnit` per model. Asking for the raw unit (per-token vs. per-1k vs. per-1M) and converting in code is more reliable than asking the LLM to do unit math.
3. Normalizes everything to USD-per-1M-tokens.
4. Compares against the previous run. Any drift opens a GitHub issue with a diff.

A human reviews flagged changes, verifies against the vendor page, and merges. `pricing.json` in this repo is regenerated from the source dataset and pushed.

## Why a human is in the loop

Vendors change their pricing pages constantly — new tiers, renamed models, struck-through old prices kept for SEO. A pure-extraction pipeline catches the easy stuff but ships nonsense on edge cases (one early run priced Gemini Pro at $1,250 per million tokens because the page used per-token pricing in scientific notation). The human review step is what makes the data trustworthy.

If a price changes and we haven't reviewed it yet, the audit issue stays open and the JSON stays at the previous verified value. The `verifiedDate` field tells you when the dataset was last confirmed end-to-end.

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
