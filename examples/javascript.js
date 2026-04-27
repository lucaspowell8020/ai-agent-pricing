// Estimate the cost of a workflow given input/output token counts.
//
//   node javascript.js
//
// No dependencies. Works in Node 18+.

const URL =
  "https://raw.githubusercontent.com/lucaspowell8020/ai-agent-pricing/main/pricing.json";

const data = await fetch(URL).then((r) => r.json());

function costFor(slug, inputTokens, outputTokens) {
  const model = data.models.find((m) => m.slug === slug);
  if (!model) throw new Error(`Unknown model: ${slug}`);
  const inputCost = (inputTokens / 1_000_000) * model.inputPricePerMillion;
  const outputCost = (outputTokens / 1_000_000) * model.outputPricePerMillion;
  return { model: model.name, inputCost, outputCost, total: inputCost + outputCost };
}

// 5,000 lead-research runs/month, ~2,000 input tokens and 400 output tokens each.
const calls = 5_000;
const inputPerCall = 2_000;
const outputPerCall = 400;

const totalIn = calls * inputPerCall;
const totalOut = calls * outputPerCall;

console.log(`Verified: ${data.verifiedDate}`);
console.log(`Workload: ${calls.toLocaleString()} calls/month\n`);

for (const slug of ["claude-opus-4-7", "claude-sonnet-4-6", "claude-haiku-4-5", "deepseek-v4-flash"]) {
  const { model, total } = costFor(slug, totalIn, totalOut);
  console.log(`${model.padEnd(28)} $${total.toFixed(2)}/month`);
}
