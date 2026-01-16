// api/analyze.js
// Vercel Serverless Function (Node)
// Erwartet POST JSON: { cvText: string, role: string|object, requirements: string[] }

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Body robust parsen
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch { /* ignore */ }
    }

    const { cvText, role, requirements } = body || {};

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

    const reqList = Array.isArray(requirements) ? requirements.filter(Boolean) : [];
    if (reqList.length === 0) {
      return res.status(400).json({ error: "requirements missing/empty" });
    }

    // API Key aus Env (Fallbacks, falls du anders benannt hast)
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GENERATIVE_LANGUAGE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "API key not set (GEMINI_API_KEY / GOOGLE_API_KEY)" });
    }

    // Wunsch-Modell (optional). Wenn nicht gesetzt, nehmen wir ein modernes Default.
    // Wichtig: falls jemand "models/..." einträgt -> entfernen
    let desiredModel = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    desiredModel = String(desiredModel).replace(/^models\//, "").trim();

    console.log("[analyze] roleName:", roleName);
    console.log("[analyze] requirements:", reqList.length);
    console.log("[analyze] cvText length:", cvText.trim().length);
    console.log("[analyze] desiredModel:", desiredModel);
    console.log("[analyze] apiKey set:", true);

    const requirementsText = reqList.join("\n");

    const prompt = `Antworte AUSSCHLIESSLICH als valides JSON (kein Markdown, kein Text drumherum).

Analysiere den folgenden Lebenslauf für die Position "${roleName}" anhand der Stellenanforderungen. Bewerte die PASSGENAUIGKEIT zur ausgeschriebenen Stelle.

LEBENSLAUF TEXT:
${cvText}

STELLENANFORDERUNGEN:
${requirementsText}

WICHTIG - Bewertungsrichtlinien für Passgenauigkeit:

Für JUNIOREN (0-3 Jahre, Studenten, Berufseinsteiger):
- Gib 80-100% wenn:
  * Studiert/studierte etwas Relevantes ODER
  * Hat Praktikum/Werkstudent im Bereich ODER
  * Zeigt Interesse am Technologiebereich
- Gib 60-79% wenn:
  * Hat technischen Hintergrund ODER
  * Zeigt Interesse an ähnlichen Bereichen
- Gib 50-59% wenn:
  * Hat irgendeine technische Erfahrung ODER
  * Studiert etwas Technisches
- Unter 50% NUR wenn absolut keine Berührungspunkte

SEHR WICHTIG - Bewertungsfokus für Junioren:
- Sei SEHR GROSSZÜGIG bei der Bewertung!
- Jeder Berührungspunkt mit einer Technologie = mindestens 50%
- Relevantes Studium = mindestens 70% pro Anforderung
- Praktika/Werkstudent = mindestens 80% in dem Bereich
- Interesse/Motivation = stark positiv werten
- Verwandte Technologien/Erfahrungen = großzügig bewerten
- Bei Studenten/Absolventen: Potenzial > aktuelle Erfahrung

Du MUSST genau dieses Format verwenden:
{
  "overall_score": 75,
  "seniority_level": "Senior",
  "requirement_matches": [
    { "requirement": "X", "match_percentage": 80, "explanation": "Kurz" }
  ],
  "summary": "Kurz",
  "key_strengths": ["A", "B"],
  "improvement_areas": ["C", "D"]
}

Bewerte jede Anforderung einzeln und gib einen Prozentsatz (0-100) für den Match an.`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 1600 }
    };

    const base = "https://generativelanguage.googleapis.com/v1beta";

    const fetchJson = async (url, options) => {
      const r = await fetch(url, options);
      const raw = await r.text();
      let data = null;
      try { data = raw ? JSON.parse(raw) : null; } catch {}
      return { ok: r.ok, status: r.status, data, raw, url };
    };

    const callGenerate = async (modelName) => {
      const url = `${base}/models/${modelName}:generateContent?key=${apiKey}`;
      return fetchJson(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    };

    const listModels = async () => {
      const url = `${base}/models?key=${apiKey}`;
      return fetchJson(url, { method: "GET" });
    };

    // 1) Versuch: desiredModel
    let resp = await callGenerate(desiredModel);

    // 2) Wenn 404: Modelle listen, erstes Modell mit generateContent suchen, retry
    if (!resp.ok && resp.status === 404) {
      console.warn("[analyze] generateContent 404 -> calling ListModels");
      const lm = await listModels();

      if (!lm.ok) {
        console.error("[analyze] ListModels failed:", lm.status, lm.raw?.slice(0, 500));
        return res.status(502).json({
          error: "ListModels failed",
          status: lm.status,
          raw: lm.raw?.slice(0, 2000)
        });
      }

      const models = lm.data?.models || [];
      const genModel = models.find(m =>
        Array.isArray(m.supportedGenerationMethods) &&
        m.supportedGenerationMethods.includes("generateContent")
      );

      if (!genModel?.name) {
        // Sehr typisch: nur Embedding-Modelle vorhanden
        const names = models.map(m => m.name).slice(0, 50);
        return res.status(403).json({
          error: "Your API key has no access to text generation models (generateContent).",
          hint: "Create/use a Gemini API key from Google AI Studio (Gemini API) or adjust your account/project provisioning.",
          available_models: names
        });
      }

      const discovered = String(genModel.name).replace(/^models\//, "");
      console.warn("[analyze] discovered generateContent model:", discovered);
      resp = await callGenerate(discovered);
    }

    // 3) Fehler rausgeben
    if (!resp.ok) {
      const msg = resp?.data?.error?.message;
      console.error("[analyze] Gemini error status:", resp.status);
      console.error("[analyze] Gemini url:", resp.url);
      console.error("[analyze] Gemini error message:", msg || "(no message)");
      console.error("[analyze] Gemini error body head:", JSON.stringify(resp.data || resp.raw || "").slice(0, 1500));

      return res.status(resp.status).json({
        error: "Gemini request failed",
        status: resp.status,
        url: resp.url,
        message: msg,
        details: resp.data || resp.raw?.slice(0, 2000)
      });
    }

    // 4) Content extrahieren
    const text = resp.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text || typeof text !== "string") {
      return res.status(502).json({ error: "Gemini returned empty content", raw: resp.data });
    }

    // 5) JSON robust extrahieren
    let parsed;
    try {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}") + 1;
      const jsonStr = start >= 0 && end > start ? text.slice(start, end) : text;
      parsed = JSON.parse(jsonStr);
    } catch {
      return res.status(502).json({ error: "Model did not return valid JSON", raw: text });
    }

    if (
      typeof parsed?.overall_score !== "number" ||
      !parsed?.seniority_level ||
      !Array.isArray(parsed?.requirement_matches)
    ) {
      return res.status(502).json({ error: "Invalid response structure from model", raw: parsed });
    }

    return res.status(200).json(parsed);
  } catch (e) {
    console.error("[analyze] internal error:", e);
    return res.status(500).json({ error: "Internal server error", details: String(e?.message || e) });
  }
};
