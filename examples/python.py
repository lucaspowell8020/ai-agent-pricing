"""Estimate the cost of a workflow given input/output token counts.

    python python.py

Standard library only. Python 3.8+.
"""

import json
import urllib.request

URL = "https://raw.githubusercontent.com/lucaspowell8020/ai-agent-pricing/main/pricing.json"

data = json.loads(urllib.request.urlopen(URL).read())


def cost_for(slug: str, input_tokens: int, output_tokens: int):
    model = next((m for m in data["models"] if m["slug"] == slug), None)
    if model is None:
        raise ValueError(f"Unknown model: {slug}")
    input_cost = (input_tokens / 1_000_000) * model["inputPricePerMillion"]
    output_cost = (output_tokens / 1_000_000) * model["outputPricePerMillion"]
    return model["name"], input_cost + output_cost


# 5,000 lead-research runs/month, ~2,000 input tokens and 400 output tokens each.
calls = 5_000
input_per_call = 2_000
output_per_call = 400

total_in = calls * input_per_call
total_out = calls * output_per_call

print(f"Verified: {data['verifiedDate']}")
print(f"Workload: {calls:,} calls/month\n")

for slug in ["claude-opus-4-7", "claude-sonnet-4-6", "claude-haiku-4-5", "deepseek-v4-flash"]:
    name, total = cost_for(slug, total_in, total_out)
    print(f"{name:<28} ${total:.2f}/month")
