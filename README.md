# ai-agent-pricing

A clean, machine-readable dataset of frontier AI model pricing. Verified weekly. Free to use.

If you're building agents, calculators, or comparison tools, you've probably hit the same problem we did: vendor pricing pages move, change format, and disagree on units. This repo is the pricing dataset behind [agentshortlist.com](https://agentshortlist.com), exported as a single JSON file that's easy to consume from anywhere.

## What's in here

- **`pricing.json`** — every model we track, with input/output pricing per 1M tokens, context window, vendor, tier, and notes. One file, always current.
- **`pricing.schema.json`** — JSON Schema so you can validate the file in CI.
- **`METHODOLOGY.md`** — how prices are extracted, normalized, and reviewed.
- **`examples/`** — small JavaScript and Python snippets showing how to load the data.

The file is regenerated and committed every week. If a vendor changes a price, you'll see it in the next commit. No API key, no rate limits, no auth.

## Use it

### Direct fetch

```bash
curl -O https://raw.githubusercontent.com/lucaspowell8020/ai-agent-pricing/main/pricing.json
```

### JavaScript

```js
const data = await fetch(
  "https://raw.githubusercontent.com/lucaspowell8020/ai-agent-pricing/main/pricing.json"
).then((r) => r.json());

const opus = data.models.find((m) => m.slug === "claude-opus-4-7");
console.log(opus.inputPricePerMillion, opus.outputPricePerMillion);
```

### Python

```python
import json, urllib.request

url = "https://raw.githubusercontent.com/lucaspowell8020/ai-agent-pricing/main/pricing.json"
data = json.loads(urllib.request.urlopen(url).read())

opus = next(m for m in data["models"] if m["slug"] == "claude-opus-4-7")
print(opus["inputPricePerMillion"], opus["outputPricePerMillion"])
```

See [`examples/`](./examples) for a couple of slightly fuller scripts.

## Schema

Every entry in `models` has the same shape:

| Field | Type | Notes |
|---|---|---|
| `slug` | string | Stable identifier. Won't change once published. |
| `name` | string | Human-readable name. |
| `vendor` | string | Anthropic, OpenAI, Google, etc. |
| `inputPricePerMillion` | number | USD per 1M input tokens. |
| `outputPricePerMillion` | number | USD per 1M output tokens. |
| `contextWindow` | number | Max context in tokens. |
| `tier` | string | `frontier`, `balanced`, `value`, or `open`. |
| `notes` | string | Optional editorial note. |

Top-level fields: `verifiedDate`, `verificationCadence`, `verificationMethod`, `source`, `sourceRepo`, `license`.

## How fresh is it?

Verified weekly via an automated script that fetches each vendor's pricing page, extracts prices with an LLM, normalizes units (per-token, per-1k, per-1M — vendors all use different conventions), and flags any drift against the previous run. A human reviews flagged changes before they ship.

The exact `verifiedDate` is in the JSON. If it's more than 9 days old, the audit hasn't run — open an issue.

## License

CC-BY-4.0. Use it in commercial products, calculators, comparison tools, blog posts — whatever. A link back to [agentshortlist.com](https://agentshortlist.com) is appreciated but not required.

## Why this exists

We built [agentshortlist.com](https://agentshortlist.com) — opinionated reviews of AI agent platforms for builders. Every review and calculator on the site needs accurate, current pricing. Maintaining it as scattered constants in our codebase felt wasteful when other people probably need the same thing.

So we publish it.

## Related

- [agentshortlist.com](https://agentshortlist.com) — the publication
- [Cost calculator](https://agentshortlist.com/calculator) — interactive UI on top of this data

## Contributing

Found a price that's wrong? [Open an issue](https://github.com/lucaspowell8020/ai-agent-pricing/issues) with a link to the vendor's pricing page. Pricing data lives in the source repo (`agentshortlist`), so PRs against this repo's `pricing.json` will get closed — but issues here are the right place to flag bad data.

Want a model added? Issue with vendor + model name + link to pricing page works.
