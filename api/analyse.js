export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { cvText, role, requirements, weights } = req.body || {};

    // Hard guards (damit du nie wieder null.name bekommst)
    if (!cvText || typeof cvText !== "string" || cvText.trim().length < 30) {
      return res.status(400).json({ error: "cvText missing/too short" });
    }
    if (!role) {
      return res.status(400).json({ error: "role missing" });
    }

    const roleName =
      typeof role === "string"
        ? role
        : (role.name ?? role.title ?? role.key ?? "unknown");

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "OPENAI_API_KEY not set" });
    }

    // Minimal prompt: JSON-only output (damit Frontend stabil bleibt)
    const system = `You are a CV analysis engine. Return ONLY valid JSON. No markdown.`;
    const user = `
Analyze the CV text for the role "${roleName}".

Requirements (JSON):
${JSON.stringify(requirements ?? {}, null, 2)}

Weights (JSON):
${JSON.stringify(weights ?? {}, null, 2)}

CV text:
${cvText}

Return JSON with:
{
  "skills": [{"name": string, "level": "None"|"Basic"|"Advanced"|"Expert", "reason": string, "weight": number}],
  "language": {"germanLevel": string, "meetsMinimumC1": boolean, "reason": string},
  "totalScorePercent": number,
  "seniority": "Junior"|"Professional"|"Senior"|"Principal",
  "suggestions": string[]
}
`;

    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(502).json({ error: "OpenAI request failed", details: text });
    }

    const data = await r.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(502).json({ error: "OpenAI returned empty content" });
    }

    // content ist JSON string
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      return res.status(502).json({ error: "Model did not return valid JSON", raw: content });
    }

    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: "Internal server error", details: String(e?.message || e) });
  }
}
