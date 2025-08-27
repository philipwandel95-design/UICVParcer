# SAP CV-Analyse für Energiewirtschaft

Eine intelligente Webanwendung zur Analyse von Lebensläufen für SAP-Positionen in der Energiewirtschaft. Diese App ermöglicht es, PDF-Lebensläufe hochzuladen und automatisch gegen Stellenanforderungen zu bewerten.

## Features

- **PDF-Upload**: Unterstützt PDF-Dateien für Lebenslauf-Analysen
- **Mehrere Rollen**: SAP Entwickler, SAP Consultant, Business Consultant
- **Intelligente Bewertung**: Automatische Skill-Level-Erkennung und Senioritätsbestimmung
- **Gewichtete Bewertung**: Konfigurierbare Gewichtungen für verschiedene Anforderungsgruppen
- **Moderne UI**: Responsive Design mit Light/Dark Mode
- **Debiasing**: Optionale Funktion zur Reduzierung unbewusster Verzerrungen

## Technologie-Stack

- **Frontend**: React 18 mit Material-UI
- **PDF-Verarbeitung**: PDF.js für clientseitige Text-Extraktion
- **Styling**: Emotion mit Material-UI Theme
- **Deployment**: Vercel-ready

## Installation

### Voraussetzungen

- Node.js 16+ 
- npm oder yarn

### Lokale Entwicklung

1. Repository klonen:
```bash
git clone <repository-url>
cd cv-analyzer-webapp
```

2. Dependencies installieren:
```bash
npm install
```

3. Entwicklungsserver starten:
```bash
npm start
```

4. Browser öffnen und zu `http://localhost:3000` navigieren

### Build für Produktion

```bash
npm run build
```

## Deployment auf Vercel

1. **Vercel CLI installieren** (optional):
```bash
npm i -g vercel
```

2. **Projekt deployen**:
```bash
vercel
```

Oder über die Vercel Web-Oberfläche:
- GitHub-Repository mit Vercel verbinden
- Automatisches Deployment bei jedem Push

## Verwendung

1. **Position auswählen**: Wählen Sie zwischen SAP Entwickler, SAP Consultant oder Business Consultant
2. **PDF hochladen**: Laden Sie den Lebenslauf als PDF-Datei hoch
3. **Anforderungen anpassen**: Passen Sie die Stellenanforderungen nach Bedarf an
4. **Gewichtungen konfigurieren**: Stellen Sie die Bedeutung verschiedener Anforderungsgruppen ein
5. **Analyse starten**: Klicken Sie auf "Analyse starten" für die automatische Bewertung
6. **Ergebnisse einsehen**: Überprüfen Sie die detaillierte Analyse mit Gesamtbewertung und Einzelbewertungen

## Anforderungsgruppen

- **Technische Fähigkeiten**: SAP, ABAP, Fiori, etc.
- **Fachliche Expertise**: Prozessmodellierung, Energiewirtschaft, etc.
- **Methodische Kompetenzen**: Projektmanagement, Requirements Engineering, etc.
- **Sprachkenntnisse**: Deutsch (C1-Niveau erforderlich), Englisch

## Bewertungslogik

- **Sprachkenntnisse**: Mindestanforderung C1-Niveau Deutsch (0% bei Unterschreitung)
- **Skill-Levels**: None, Basic, Advanced, Expert
- **Senioritätsstufen**: Junior, Professional, Senior, Principal
- **Gewichtete Bewertung**: Berücksichtigt Anforderungsgruppen und Skill-Levels

## Konfiguration

### Gewichtungen

- **Experten-Level**: 0.0 - 5.0 (Standard: 3.0)
- **Fortgeschritten-Level**: 0.0 - 5.0 (Standard: 2.0)
- **Basis-Level**: 0.0 - 5.0 (Standard: 1.0)
- **Berufserfahrung**: 0.0 - 5.0 (Standard: 1.0)
- **Ausbildung**: 0.0 - 5.0 (Standard: 1.0)
- **Sprachkenntnisse**: 0.0 - 5.0 (Standard: 1.0)

### Anforderungsgruppen

Jede Gruppe kann mit einem Gewicht von 0% bis 100% versehen werden, um deren Bedeutung in der Gesamtbewertung anzupassen.

## Projektstruktur

```
src/
├── App.js              # Hauptkomponente mit CV-Analyse-Logik
├── index.js            # App-Einstiegspunkt
└── ...
public/
├── index.html          # HTML-Template
└── ...
```

## Lizenz

Dieses Projekt ist proprietär und vertraulich.

## Support

Bei Fragen oder Problemen wenden Sie sich an das Entwicklungsteam. 