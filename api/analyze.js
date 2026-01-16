export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { cvText, role, requirements } = req.body || {};

    if (!cvText || typeof cvText !== "string" || cvText.trim().length < 30) {
      return res.status(400).json({ error: "cvText missing/too short" });
    }
    if (!role) {
      return res.status(400).json({ error: "role missing" });
    }

    // role kann string sein
    const roleName =
      typeof role === "string"
        ? role
        : (role.name ?? role.title ?? role.key ?? "unknown");

    // requirements sollten ein Array sein (wie im alten UI)
    const reqList = Array.isArray(requirements) ? requirements : [];
    if (reqList.length === 0) {
      return res.status(400).json({ error: "requirements missing/empty" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY not set" });
    }

    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";

    const requirementsText = reqList.join("\n");

    const prompt = `Analysiere den folgenden Lebenslauf für die Position ${roleName} anhand der Stellenanforderungen. Bewerte die PASSGENAUIGKEIT zur ausgeschriebenen Stelle.

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

WICHTIG - Formatierungsregeln für die JSON-Antwort:
1. Antworte AUSSCHLIESSLICH mit einem validen JSON-Objekt
2. Verwende KEINE Kommentare oder zusätzlichen Text
3. Alle Textfelder MÜSSEN in doppelten Anführungszeichen stehen
4. Zahlen dürfen KEINE Anführungszeichen haben
5. Maximale Länge für Textfelder: 500 Zeichen

WICHTIG - Du MUSST genau dieses Format verwenden:
{
  "overall_score": 75,
  "seniority_level": "Senior",
  "requirement_matches": [
    {
      "requirement": "SAP Core und Basis Kenntnisse",
      "match_percentage": 80,
      "explanation": "Kurze Erklärung des Matches"
    }
  ],
  "summary": "Kurze Zusammenfassung der Analyse",
  "key_strengths": ["Stärke 1", "Stärke 2"],
  "improvement_areas": ["Entwicklungspotenzial 1", "Entwicklungspotenzial 2"]
}

Bewerte jede Anforderung einzeln und gib einen Prozentsatz (0-100) für den Match an.
`;

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            // optional: etwas begrenzen
            maxOutputTokens: 1600,
          },
        }),
      }
    );

    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json({ error: "Gemini request failed", details: data });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return res.status(502).json({ error: "Gemini returned empty content", raw: data });
    }

    // JSON robust extrahieren
    let parsed;
    try {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}") + 1;
      const jsonStr = start >= 0 && end > start ? text.slice(start, end) : text;
      parsed = JSON.parse(jsonStr);
    } catch {
      return res.status(502).json({ error: "Model did not return valid JSON", raw: text });
    }

    // Minimal-Validierung fürs Frontend
    if (
      typeof parsed?.overall_score !== "number" ||
      !parsed?.seniority_level ||
      !Array.isArray(parsed?.requirement_matches)
    ) {
      return res.status(502).json({
        error: "Invalid response structure from model",
        raw: parsed,
      });
    }

    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: "Internal server error", details: String(e?.message || e) });
  }
}
