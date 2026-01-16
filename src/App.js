import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Alert,
  alpha,
  IconButton,
  CssBaseline,
  Grid,
  Stack,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItemIcon,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { UploadFile, DarkMode, LightMode, Settings as SettingsIcon, CheckCircle, TrendingUp, Info as InfoIcon } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import * as pdfjs from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;



// Predefined requirements for different roles
const jobRoleRequirements = {
  developer: [
    "Sehr gute Deutschkenntnisse (C1, Sehr Gut, Muttersprache, fließend, verhandlungssicher), sonst 0% Gesamtbewertung und Prüfung beenden",
    "Englischkenntnisse",
    "Microsoft Office Kenntnisse",
    "Prozessmodellierung",
    "SAP Core und Basis Kenntnisse",
    "SAP IS-U Kenntnisse",
    "IDEX-Framework Erfahrung",
    "S/4 Utilities Expertise",
    "MaCo Cloud (APE) /UCOM Kenntnisse",
    "Stammdaten/Datenmodelle und Messkonzepte",
    "Geräteverwaltung",
    "EDM Expertise",
    "Abrechnungs- und Fakturierungsprozesse",
    "FI-CA Kenntnisse",
    "MOS-Billing inkl. MaKo",
    "MeMi inkl. MaKo",
    "EEG Billing",
    "SAP-Transportverwaltung",
    "RAP - Rest Application Programming Model",
    "CAP - Cloud Application Programming Model",
    "BTP (Business Technology Platform) Kenntnisse",
    "Fiori und Core Data Views (CDS)",
    "ABAP, ABAP OO",
    "BTP / Integration Platform / CPI",
    "JavaScript, NodeJS, bower",
    "Python, Jupyter Notebook, Pandas",
    "HTML, CSS",
    "SOAP Webservices",
    "REST/OData",
    "SOA",
    "Solution Design/-Architektur",
    "Software-Architektur",
    "Software-Lifecycle",
    "CI/CD",
    "SQL Datenbanken",
    "BPMN Kenntnisse",
    "UML Kenntnisse",
    "Fachkonzepterstellung",
    "Erstellung Technisches Konzept",
    "Anforderungsdefinition/-management",
    "Lastenheft- und Pflichtenhefterstellung",
    "Scrum und Kanban",
    "Trainingsdesign und -durchführung",
    "Erstellung und Pflege von Projekt-, Zeit-, Ressourcenplänen",
    "Kundenservice in der Energiewirtschaft",
    "Messdatenmanagement",
    "Marktkommunikation",
    "Messkonzepte und komplexe Messstellen",
    "Wechselprozesse (GPKE, GeLi Gas, WiM)",
    "Energiemengenbilanzierung/EDM (MaBiS/GaBi Gas)",
    "EnWG Kenntnisse",
    "Netzabrechnung",
    "Einspeiserabrechnung",
    "CRM in der Energiewirtschaft",
    "Rechnungseingangsprüfung",
    "Endkundenabrechnung",
    "Smart Meter",
    "GDEW, MsbG Kenntnisse",
    "MDM - Meter Data Management",
    "Workforcemanagement und Ablesung",
    "Hochschulabschluss oder vergleichbare Qualifikation",
    "Hohes Engagement",
    "Ausgeprägte Teamfähigkeit",
    "Starke Kundenorientierung",
    "Standort: Bevorzugt Region Mannheim, Rhein-Neckar-Region und alles im Umkreis, auch Düsseldorf/Wuppertal oder Thüringen",
    "Erfahrung in vergleichbaren Unternehmen (z.B. Convista, koenig.solutions, incept4, cronos, INTENSE AG, Hochfrequenz, DSC, Power Reply, NEA Gruppe, cerebricks, ENERGY4U, Nexus Nova, DEMANDO, adesso orange)",
  ],
  consultant: [
    "Hochschulabschluss oder vergleichbare Qualifikation",
    "Sehr gute Deutschkenntnisse (C1, Sehr Gut, Muttersprache, fließend, verhandlungssicher), sonst 0% Match und Prüfung beenden",
    "Englischkenntnisse",
    "Microsoft Office Kenntnisse",
    "Erfahrung mit Prozessmodellierung (z.B. Camunda, Signavio)",
    "BPMN und UML Kenntnisse",
    "SAP Core und Basis Kenntnisse",
    "SAP IS-U Erfahrung",
    "IDEX-Framework Kenntnisse",
    "IM4G Erfahrung",
    "S/4 Utilities Expertise",
    "MaCo Cloud (APE) /UCOM Kenntnisse",
    "Erfahrung mit Stammdaten/Datenmodellen und Messkonzepten",
    "Kenntnisse in Geräteverwaltung",
    "EDM Expertise",
    "Abrechnungs- und Fakturierungsprozesse",
    "FI-CA Kenntnisse",
    "MOS-Billing inkl. MaKo",
    "MeMi inkl. MaKo",
    "EEG Billing",
    "BTP (Business Technology Platform)",
    "Fiori und Core Data Views (CDS)",
    "ABAP, ABAP OO",
    "BTP / Integration Platform / CPI",
    "HTML, CSS",
    "REST/OData",
    "SOA",
    "Solution Design/-Architektur",
    "Software-Architektur",
    "Software-Lifecycle",
    "SQL Datenbanken",
    "Prozessanalyse und Prozessbeschreibung",
    "Testen, Testfälle, Testkoordination",
    "Fachkonzepterstellung",
    "Erstellung Technisches Konzept",
    "Anforderungsdefinition/-management",
    "Lastenheft- und Pflichtenhefterstellung",
    "Make or Buy Analyse",
    "Kosten-Nutzen-Bewertung",
    "Scrum und Kanban",
    "Durchführung von fit/gap Workshops",
    "Trainingsdesign und -durchführung",
    "Erstellung und Pflege von Projekt-, Zeit-, Ressourcenplänen",
    "Kundenservice in der Energiewirtschaft",
    "Messdatenmanagement",
    "Marktkommunikation",
    "Messkonzepte und komplexe Messstellen",
    "Wechselprozesse (GPKE, GeLi Gas, WiM)",
    "Energiemengenbilanzierung/EDM (MaBiS/GaBi Gas)",
    "EnWG Kenntnisse",
    "Netzabrechnung",
    "Einspeiserabrechnung",
    "CRM in der Energiewirtschaft",
    "Rechnungseingangsprüfung",
    "Endkundenabrechnung",
    "Smart Meter",
    "GDEW, MsbG Kenntnisse",
    "MDM - Meter Data Management",
    "Workforcemanagement und Ablesung",
    "Hohes Engagement",
    "Ausgeprägte Teamfähigkeit",
    "Starke Kundenorientierung",
    "Standort: Bevorzugt Region Mannheim, Rhein-Neckar-Region und alles im Umkreis, auch Düsseldorf/Wuppertal oder Thüringen",
    "Erfahrung in vergleichbaren Unternehmen (z.B. Convista, koenig.solutions, incept4, cronos, INTENSE AG, Hochfrequenz, DSC, Power Reply, NEA Gruppe, cerebricks, ENERGY4U, Nexus Nova, DEMANDO, adesso orange)",
  ],
  business_consultant: [
    "Sehr gute Deutschkenntnisse (C1, Sehr Gut, Muttersprache, fließend, verhandlungssicher), sonst 0% Gesamtbewertung und Prüfung beenden",
    "Energiewirtschaftliche Prozesse",
    "Digitalisierung der Energiewende",
    "Netz- und Messstellenbetrieb",
    "Energiemarkt-Regelwerke (BDEW, BNetzA, iMS, GPKE, edi@energy)",
    "Abrechnung & Fakturierung (FI-CA, MOS-, EEG-Billing)",
    "Design und Implementierung von IT-Systemen",
    "Prozessmodellierung",
    "Prozessberatung",
    "Prozessoptimierung",
    "Change Management",
    "Workshopleitung",
    "Standort: Bevorzugt Region Mannheim, Rhein-Neckar-Region und alles im Umkreis, auch Düsseldorf/Wuppertal oder Thüringen",
    "Erfahrung in vergleichbaren Unternehmen (z.B. Convista, koenig.solutions, incept4, cronos, INTENSE AG, Hochfrequenz, DSC, Power Reply, NEA Gruppe, cerebricks, ENERGY4U, Nexus Nova, DEMANDO, adesso orange)"
  ]
};

// Theme configuration
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: '#2e7d32',
          },
          secondary: {
            main: '#7b1fa2',
          },
          background: {
            default: '#f5f5f5',
            paper: '#ffffff',
          },
        }
      : {
          primary: {
            main: '#4caf50',
          },
          secondary: {
            main: '#ba68c8',
          },
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
        }),
  },
});

// Helper function to get score color
  const getScoreColor = (theme, score) => {
    if (score >= 60) {
      const intensity = (score - 60) / 40;
      return theme.palette.mode === 'light'
        ? `rgb(${Math.round(46 - (intensity * 10))}, ${Math.round(125 + (intensity * 50))}, ${Math.round(50 + (intensity * 30))})`
        : `rgb(${Math.round(76 + (intensity * 50))}, ${Math.round(175 + (intensity * 50))}, ${Math.round(80 + (intensity * 50))})`;
    }
    return theme.palette.error.main;
  };

// PDF text extraction function with enhanced text extraction
const extractTextFromPDF = async (file) => {
  try {
    console.log('📄 Starting enhanced PDF text extraction...');
    
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load PDF with more options for better text extraction
    const loadingTask = pdfjs.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      disableFontFace: false,
      ignoreErrors: true,
      isEvalSupported: true,
      cMapUrl: '/node_modules/pdfjs-dist/cmaps/',
      cMapPacked: true
    });

    const pdf = await loadingTask.promise;
    console.log('📄 PDF loaded, pages:', pdf.numPages);
    
    let fullText = '';
    
    // Extract text from each page with enhanced options
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      console.log(`📄 Processing page ${pageNum}...`);
      const page = await pdf.getPage(pageNum);
      
      // Get text content with better options
      const textContent = await page.getTextContent({
        normalizeWhitespace: true,
        disableCombineTextItems: false,
        includeMarkedContent: true,
        disableNormalization: false
      });
      
      // Just get the text content directly
      let pageText = '';
      
      for (const item of textContent.items) {
        // Add the text content
        if (item.str && item.str.trim()) {
          pageText += item.str + ' ';
        }
      }
      
      fullText += pageText + '\n\n';
      console.log(`📄 Page ${pageNum} text length:`, pageText.length);
    }
    
    // Clean up the text while preserving important whitespace
    const cleanedText = fullText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')
      .replace(/[ \t]+/g, ' ')      // Normalize spaces and tabs
      .replace(/\n{3,}/g, '\n\n')   // Replace multiple newlines with double newline
      .trim();
    
    if (cleanedText.length >= 1) {  // Accept any text content
      console.log('📄 Text extraction successful');
      console.log('📄 Total text length:', cleanedText.length);
      console.log('📄 Text preview:', cleanedText.substring(0, 200) + '...');
      return cleanedText;
    }
    
    // If extraction fails, return a helpful message
    console.warn('⚠️ Text extraction failed');
    return `PDF Text konnte nicht extrahiert werden. 
    Möglicherweise handelt es sich um eine bildbasierte PDF-Datei.
    Bitte verwenden Sie die manuelle Texteingabe oder eine PDF-Datei mit auswählbarem Text.
    
    Dateiname: ${file.name}
    Dateigröße: ${file.size} Bytes
    
    Alternativ können Sie den CV-Text direkt in das Textfeld eingeben.`;
    
  } catch (error) {
    console.error('❌ PDF text extraction error:', error);
    return `PDF Text konnte nicht extrahiert werden: ${error.message}
    
    Dateiname: ${file.name}
    Dateigröße: ${file.size} Bytes
    Dateityp: ${file.type}
    
    Bitte verwenden Sie die manuelle Texteingabe oder versuchen Sie es mit einer anderen PDF-Datei.`;
  }
};

// CV Analysis Functions - API-based approach
const performCVAnalysis = async (file, requirements, role, cvText, weights) => {
  try {
    console.log("🚀 Starting CV analysis (via /api/analyze)...");

    // 1) CV-Text bestimmen
    let cvTextContent;
    if (cvText && cvText.trim()) {
      console.log("📄 Using manually entered CV text...");
      cvTextContent = cvText.trim();
    } else {
      if (!file) throw new Error("Bitte eine PDF auswählen oder CV-Text eingeben.");
      console.log("📄 Extracting text from PDF...");
      cvTextContent = await extractTextFromPDF(file);
    }

    if (!cvTextContent || cvTextContent.trim().length < 30) {
      throw new Error("CV-Text ist zu kurz (mind. 30 Zeichen).");
    }

    // 2) Serverless Endpoint aufrufen (Gemini läuft in api/analyze.js)
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cvText: cvTextContent,
        role,          // z.B. "developer"
        requirements,  // array von strings
        weights,       // dein weights object
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ /api/analyze failed:", data);
      throw new Error(data?.error || "Analyse fehlgeschlagen");
    }

    // 3) data ist schon dein Analyse-JSON
    return data;
  } catch (error) {
    console.error("❌ Analysis error:", error);
    throw new Error("Fehler bei der CV-Analyse: " + error.message);
  }
};


// Main App Component
function App() {
  const [mode, setMode] = useState('light');
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [cvText, setCvText] = useState('');
  const [requirements, setRequirements] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('developer');
  const [openSettings, setOpenSettings] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  
  // Weight sliders state
  const [weights, setWeights] = useState({
    expertWeight: 3.0,
    advancedWeight: 2.0,
    basicWeight: 1.0,
    experienceWeight: 1.0,
    educationWeight: 1.0,
    languageWeight: 1.0
  });

  // Requirement groups state
  const [requirementGroups, setRequirementGroups] = useState({
    'Technische Fähigkeiten': {
      weight: 1.0,
      requirements: []
    },
    'Fachliche Expertise': {
      weight: 1.0,
      requirements: []
    },
    'Methodische Kompetenzen': {
      weight: 1.0,
      requirements: []
    },
    'Sprachkenntnisse': {
      weight: 1.0,
      requirements: []
    }
  });

  const handleWeightChange = (weight) => (event, newValue) => {
    setWeights(prev => ({
      ...prev,
      [weight]: newValue
    }));
  };

  const handleGroupWeightChange = (groupName) => (event, newValue) => {
    setRequirementGroups(prev => ({
      ...prev,
      [groupName]: {
        ...prev[groupName],
        weight: newValue
      }
    }));
  };

  const handleOpenSettings = () => {
    setOpenSettings(true);
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const handleRoleChange = (event) => {
    const role = event.target.value;
    setSelectedRole(role);
    
    // Reset requirement groups
    const newRequirementGroups = {
      'Technische Fähigkeiten': {
        weight: 1.0,
        requirements: []
      },
      'Fachliche Expertise': {
        weight: 1.0,
        requirements: []
      },
      'Methodische Kompetenzen': {
        weight: 1.0,
        requirements: []
      },
      'Sprachkenntnisse': {
        weight: 1.0,
        requirements: []
      }
    };

    // Group requirements based on role
    const roleRequirements = jobRoleRequirements[role];
    roleRequirements.forEach(req => {
      if (req.includes('SAP') || req.includes('ABAP') || req.includes('Fiori')) {
        newRequirementGroups['Technische Fähigkeiten'].requirements.push(req);
      } else if (req.includes('Prozess') || req.includes('Energie')) {
        newRequirementGroups['Fachliche Expertise'].requirements.push(req);
      } else if (req.includes('Methodik') || req.includes('Management')) {
        newRequirementGroups['Methodische Kompetenzen'].requirements.push(req);
      } else if (req.includes('Deutsch') || req.includes('Englisch')) {
        newRequirementGroups['Sprachkenntnisse'].requirements.push(req);
      }
    });

    setRequirementGroups(newRequirementGroups);
    setRequirements(roleRequirements.join('\n'));
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleRequirementsChange = (event) => {
    setRequirements(event.target.value);
  };

  // Function to test PDF text extraction
  const testPDFExtraction = async () => {
    if (!selectedFile) {
      setError("Bitte eine PDF-Datei auswählen.");
      return;
    }
    
    setError('');
    setExtractedText('');
    setLoading(true);
    
    try {
      console.log('🧪 Testing PDF text extraction...');
      const text = await extractTextFromPDF(selectedFile);
      setExtractedText(text);
      console.log('🧪 Extraction test completed');
    } catch (error) {
      console.error('🧪 Extraction test failed:', error);
      setError("PDF Text-Extraktion fehlgeschlagen: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setResults(null);
    setLoading(true);

         if (!selectedFile && !cvText.trim()) {
       setError("Bitte eine PDF-Datei auswählen oder CV-Text eingeben.");
       setLoading(false);
       return;
     }

    try {
      // Get requirements from requirement groups
      const allRequirements = Object.values(requirementGroups)
        .flatMap(group => group.requirements)
        .filter(req => req);
      
      if (allRequirements.length === 0) {
        setError("Keine Stellenanforderungen gefunden. Bitte wählen Sie eine Position aus.");
        setLoading(false);
        return;
      }
      
             // Perform CV analysis using AI API
      const analysisResults = await performCVAnalysis(
        selectedFile,
        allRequirements,
        selectedRole,
        cvText,
        weights
      );      
            // Apply group weights to the results
      if (requirementGroups) {
        const weightedMatches = [];
        let weightedOverallScore = 0;
        let totalWeight = 0;
        
        analysisResults.requirement_matches.forEach(match => {
          // Find which group this requirement belongs to
          for (const [, groupData] of Object.entries(requirementGroups)) {
            if (groupData.requirements.includes(match.requirement)) {
              const groupWeight = parseFloat(groupData.weight);
              const weightedScore = match.match_percentage * groupWeight;
              match.original_percentage = match.match_percentage;
              match.match_percentage = weightedScore;
              weightedMatches.push(match);
              
              weightedOverallScore += weightedScore;
              totalWeight += groupWeight;
              break;
            }
          }
        });
        
        // Update the matches and overall score
        analysisResults.requirement_matches = weightedMatches;
        if (totalWeight > 0) {
          analysisResults.overall_score = weightedOverallScore / weightedMatches.length;
        }
      }
      
      setResults(analysisResults);
    } catch (error) {
      console.error('Error during analysis:', error);
      setError("Fehler beim Analysieren des Lebenslaufs: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initialize requirements when component mounts
  useEffect(() => {
    handleRoleChange({ target: { value: 'developer' } });
  }, []);

  // Compute displayed overall score
  const overallDisplay = results ? Math.min(100, Math.round(results.overall_score ?? 0)) : 0;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ 
        py: 6, 
        px: { xs: 2, sm: 3, md: 4 },
        '@media (min-width: 1200px)': {
          px: 6,
        },
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{
              background: 'linear-gradient(45deg, #2e7d32, #7b1fa2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            SAP CV-Analyse für Energiewirtschaft
          </Typography>
          <IconButton onClick={toggleColorMode} color="inherit" sx={{ ml: 2 }}>
            {mode === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4,
                height: '100%',
                background: (theme) => theme.palette.mode === 'light'
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.95))'
                  : 'linear-gradient(135deg, rgba(26,28,30,0.9), rgba(26,28,30,0.95))',
                backdropFilter: 'blur(20px)',
                border: (theme) => `1px solid ${
                  theme.palette.mode === 'light' 
                    ? 'rgba(30, 132, 73, 0.1)'
                    : 'rgba(39, 174, 96, 0.1)'
                }`,
                borderRadius: 3,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: (theme) => `0 16px 48px ${
                    theme.palette.mode === 'light'
                      ? 'rgba(30, 132, 73, 0.12)'
                      : 'rgba(39, 174, 96, 0.12)'
                  }`,
                },
              }}
            >
              <Stack spacing={2}>
                <Typography variant="h6" gutterBottom>
                  Position auswählen
                </Typography>

                <Button
                  variant={selectedRole === 'developer' ? 'contained' : 'outlined'}
                  onClick={() => handleRoleChange({ target: { value: 'developer' }})}
                  fullWidth
                  size="large"
                >
                  SAP Entwickler
                </Button>
                <Button
                  variant={selectedRole === 'consultant' ? 'contained' : 'outlined'}
                  onClick={() => handleRoleChange({ target: { value: 'consultant' }})}
                  fullWidth
                  size="large"
                >
                  SAP Consultant
                </Button>
                <Button
                  variant={selectedRole === 'business_consultant' ? 'contained' : 'outlined'}
                  onClick={() => handleRoleChange({ target: { value: 'business_consultant' }})}
                  fullWidth
                  size="large"
                >
                  Business Consultant
                </Button>

                                 <Box sx={{ mt: 4 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                   Option 1: PDF hochladen (empfohlen)
                 </Typography>
                   <input
                     accept="application/pdf"
                     style={{ display: 'none' }}
                     id="cv-file-upload"
                     type="file"
                     onChange={handleFileChange}
                   />
                   <label htmlFor="cv-file-upload">
                     <Button
                       variant="contained"
                       component="span"
                       startIcon={<UploadFile />}
                       fullWidth
                       size="large"
                     >
                       PDF-Lebenslauf hochladen
                     </Button>
                   </label>
                                       {selectedFile && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ color: 'primary.main', mb: 1 }}>
                          Ausgewählte Datei: {selectedFile.name}
                        </Typography>
                        
                        {/* PDF Preview */}
                        <Paper elevation={1} sx={{ p: 2, backgroundColor: 'background.default' }}>
                          <Typography variant="caption" color="text.secondary" gutterBottom>
                            PDF Vorschau (erste Seite):
                          </Typography>
                          <Box sx={{ 
                            maxHeight: 200, 
                            overflow: 'auto', 
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            p: 1
                          }}>
                            <Document file={selectedFile}>
                              <Page pageNumber={1} width={200} />
                            </Document>
                          </Box>
                        </Paper>

                        {/* PDF Text Extraction Test Section */}
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            PDF Text-Extraktion testen
                          </Typography>
                          <Button
                            variant="outlined"
                            onClick={testPDFExtraction}
                            disabled={loading}
                            startIcon={<UploadFile />}
                            fullWidth
                            size="medium"
                            sx={{ mb: 2 }}
                          >
                            {loading ? <CircularProgress size={20} /> : '🧪 PDF Text extrahieren (Test)'}
                          </Button>
                          
                          {extractedText && (
                            <Paper elevation={1} sx={{ p: 2, backgroundColor: 'background.default' }}>
                              <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.main' }}>
                                Extrahierter PDF-Text:
                              </Typography>
                              <TextField
                                multiline
                                rows={6}
                                value={extractedText}
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                  readOnly: true,
                                  style: { 
                                    fontFamily: 'monospace',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.4
                                  }
                                }}
                                sx={{
                                  '& .MuiInputBase-root': {
                                    backgroundColor: 'background.paper'
                                  }
                                }}
                              />
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Textlänge: {extractedText.length} Zeichen
                              </Typography>
                            </Paper>
                          )}
                        </Box>
                      </Box>
                    )}
                    
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
                      Option 2: CV-Text direkt eingeben (falls PDF-Extraktion nicht funktioniert)
                    </Typography>
                                       <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Kopieren Sie den Text aus Ihrem Lebenslauf und fügen Sie ihn hier ein. Dies ist besonders nützlich, wenn die PDF-Extraktion nicht funktioniert.
                      <strong> Empfehlung: Verwenden Sie diese Option für zuverlässigere Ergebnisse!</strong>
                    </Typography>
                   <TextField
                     multiline
                     rows={4}
                     placeholder="Fügen Sie hier den CV-Text ein (z.B. Ausbildung, Berufserfahrung, Fähigkeiten)..."
                     fullWidth
                     variant="outlined"
                     value={cvText || ''}
                     onChange={(e) => setCvText(e.target.value)}
                   />
                 </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4,
                height: '100%',
                background: (theme) => theme.palette.mode === 'light'
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.95))'
                  : 'linear-gradient(135deg, rgba(26,28,30,0.9), rgba(26,28,30,0.95))',
                backdropFilter: 'blur(20px)',
                border: (theme) => `1px solid ${
                  theme.palette.mode === 'light' 
                    ? 'rgba(30, 132, 73, 0.1)'
                    : 'rgba(39, 174, 96, 0.1)'
                }`,
                borderRadius: 3,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: (theme) => `0 16px 48px ${
                    theme.palette.mode === 'light'
                      ? 'rgba(30, 132, 73, 0.12)'
                      : 'rgba(39, 174, 96, 0.12)'
                  }`,
                },
              }}
            >
              <Typography variant="h6" gutterBottom>
                Stellenanforderungen für {selectedRole === 'developer' ? 'SAP Entwickler' : selectedRole === 'consultant' ? 'SAP Consultant' : 'Business Consultant'}
              </Typography>

              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" gutterBottom>
                  Stellenanforderungen
                </Typography>
                <IconButton 
                  onClick={handleOpenSettings}
                  sx={{ 
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1)
                    }
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Box>

              <TextField
                multiline
                rows={10}
                value={requirements}
                onChange={handleRequirementsChange}
                fullWidth
                variant="outlined"
                placeholder="Fügen Sie hier die Stellenanforderungen ein..."
              />

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 2,
                    borderRadius: 2,
                  }}
                >
                  {error}
                </Alert>
              )}

                               <Button
                   variant="contained"
                   onClick={handleSubmit}
                   disabled={loading}
                   size="large"
                   sx={{
                     mt: 2,
                     py: 1.5,
                     width: '100%',
                   }}
                 >
                   {loading ? <CircularProgress size={24} /> : 'Analyse starten'}
                 </Button>
                 
 
            </Paper>
          </Grid>
        </Grid>

        {/* Requirements Section with inline sliders */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 3,
                backgroundColor: 'background.paper',
                borderRadius: 2
              }}
            >
              <Typography variant="h6" gutterBottom>
                Stellenanforderungen nach Gruppen
              </Typography>
              
              {Object.entries(requirementGroups).map(([groupName, group]) => (
                <Box key={groupName} sx={{ mb: 3 }}>
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      mb: 1 
                    }}>
                      <Typography variant="subtitle1" color="primary" sx={{ flex: '1 1 auto', display: 'flex', alignItems: 'center' }}>
                        {groupName}
                        <Tooltip 
                          title="Diese Gruppe enthält spezifische Anforderungen für die Position. Passen Sie die Gewichtung an, um die Bedeutung dieser Gruppe in der Gesamtbewertung zu ändern."
                          arrow
                          placement="top"
                        >
                          <InfoIcon 
                            sx={{
                              ml: 1, 
                              fontSize: '1rem', 
                              color: 'text.secondary',
                              cursor: 'help'
                            }} 
                          />
                        </Tooltip>
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        width: '250px',
                        ml: 2 
                      }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            mr: 2,
                            color: 'text.secondary',
                            fontSize: '0.875rem',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Gewichtung:
                        </Typography>
                        <Box sx={{ 
                          flexGrow: 1,
                          mr: 1,
                          '& .MuiSlider-root': {
                            padding: '8px 0',
                            height: 4
                          },
                          '& .MuiSlider-thumb': {
                            width: 16,
                            height: 16
                          }
                        }}>
                          <Slider
                            value={group.weight}
                            onChange={handleGroupWeightChange(groupName)}
                            min={0}
                            max={1}
                            step={0.1}
                            size="small"
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ 
                          minWidth: '45px',
                          textAlign: 'right',
                          fontSize: '0.875rem'
                        }}>
                          {(group.weight * 100).toFixed(0)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    pl: 2, 
                    borderLeft: '2px solid', 
                    borderColor: 'primary.main',
                    ml: 1
                  }}>
                    {group.requirements.map((req, index) => (
                      <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                        • {req}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>

        {/* Settings Dialog */}
        <Dialog
          open={openSettings}
          onClose={handleCloseSettings}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            elevation: 8,
            sx: {
              borderRadius: 2
            }
          }}
        >
          <DialogTitle>
            <Typography variant="h5" component="div">
              Allgemeine Gewichtungen
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Skill-Level Gewichtungen
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>
                    Experten-Level: {weights.expertWeight.toFixed(1)}
                  </Typography>
                  <Slider
                    value={weights.expertWeight}
                    onChange={handleWeightChange('expertWeight')}
                    min={0}
                    max={5}
                    step={0.1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>
                    Fortgeschritten-Level: {weights.advancedWeight.toFixed(1)}
                  </Typography>
                  <Slider
                    value={weights.advancedWeight}
                    onChange={handleWeightChange('advancedWeight')}
                    min={0}
                    max={5}
                    step={0.1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>
                    Basis-Level: {weights.basicWeight.toFixed(1)}
                  </Typography>
                  <Slider
                    value={weights.basicWeight}
                    onChange={handleWeightChange('basicWeight')}
                    min={0}
                    max={5}
                    step={0.1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Grid>
              </Grid>

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                Zusätzliche Gewichtungen
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>
                    Berufserfahrung: {weights.experienceWeight.toFixed(1)}
                  </Typography>
                  <Slider
                    value={weights.experienceWeight}
                    onChange={handleWeightChange('experienceWeight')}
                    min={0}
                    max={5}
                    step={0.1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>
                    Ausbildung: {weights.educationWeight.toFixed(1)}
                  </Typography>
                  <Slider
                    value={weights.educationWeight}
                    onChange={handleWeightChange('educationWeight')}
                    min={0}
                    max={5}
                    step={0.1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>
                    Sprachkenntnisse: {weights.languageWeight.toFixed(1)}
                  </Typography>
                  <Slider
                    value={weights.languageWeight}
                    onChange={handleWeightChange('languageWeight')}
                    min={0}
                    max={5}
                    step={0.1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSettings} color="primary">
              Schließen
            </Button>
          </DialogActions>
        </Dialog>

        {/* Results display section */}
        {results && (
          <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Analyseergebnisse
            </Typography>
            
            <Box sx={{ 
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 3
            }}>
              <Box sx={{ 
                position: 'relative', 
                display: 'inline-flex', 
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CircularProgress
                  variant="determinate"
                  value={overallDisplay}
                  size={120}
                  thickness={4}
                  sx={{
                    color: (theme) => getScoreColor(theme, overallDisplay)
                  }}
                />
                <Box sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Typography 
                    variant="h4"
                    component="div" 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: '2rem',
                      color: (theme) => getScoreColor(theme, overallDisplay)
                    }}
                  >
                    {overallDisplay}%
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="h5" gutterBottom>
                  Passgenauigkeit zur Stelle
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Erfahrungsstufe: {results.seniority_level}
                </Typography>

              </Box>
            </Box>

            {/* Language Skills Section */}
            {requirementGroups["Sprachkenntnisse"] && requirementGroups["Sprachkenntnisse"].requirements.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium' }}>
                  Sprachkenntnisse:
                </Typography>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2,
                    backgroundColor: (theme) => 
                      theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.02)',
                  }}
                >
                  {requirementGroups["Sprachkenntnisse"].requirements.map((req, index) => {
                    const matchingResult = results.requirement_matches?.find(
                      match => match.requirement === req
                    );
                    return (
                      <Typography 
                        key={index}
                        variant="body2" 
                        sx={{ 
                          mb: 1,
                          color: (theme) => {
                            if (!matchingResult) return 'text.primary';
                            return getScoreColor(theme, matchingResult.match_percentage);
                          }
                        }}
                      >
                        • {req}
                        {matchingResult && (
                          <span style={{ marginLeft: '8px' }}>
                            {matchingResult.original_percentage && (
                              <span style={{ 
                                color: 'text.secondary',
                                textDecoration: 'line-through',
                                marginRight: '8px'
                              }}>
                                {Math.round(matchingResult.original_percentage)}%
                              </span>
                            )}
                            <span style={{ fontWeight: 'bold' }}>
                              {Math.round(matchingResult.match_percentage)}%
                            </span>
                          </span>
                        )}
                      </Typography>
                    );
                  })}
                </Paper>
              </Box>
            )}

            {results.requirement_matches && results.requirement_matches.length > 0 && (
              <>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                  Anforderungsabgleich:
                </Typography>
                <List>
                  {results.requirement_matches
                    .filter(match => !requirementGroups["Sprachkenntnisse"]?.requirements.includes(match.requirement))
                    .map((match, index) => (
                    <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'stretch', py: 1 }}>
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          p: 2, 
                          backgroundColor: (theme) => 
                            theme.palette.mode === 'dark' 
                              ? 'rgba(255, 255, 255, 0.05)'
                              : 'rgba(0, 0, 0, 0.02)',
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2">
                            {match.requirement}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {match.original_percentage && (
                              <Typography 
                                variant="body2"
                                sx={{ 
                                  color: 'text.secondary',
                                  fontSize: '0.875rem',
                                  textDecoration: 'line-through'
                                }}
                              >
                                {Math.round(match.original_percentage)}%
                              </Typography>
                            )}
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                color: (theme) => getScoreColor(theme, match.match_percentage)
                              }}
                            >
                              {Math.round(match.match_percentage)}%
                            </Typography>
                          </Box>
                        </Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.secondary',
                            whiteSpace: 'pre-line'
                          }}
                        >
                          {match.explanation}
                        </Typography>
                      </Paper>
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {results.key_strengths && results.key_strengths.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Stärken:
                </Typography>
                <List>
                  {results.key_strengths.map((strength, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText primary={strength} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {results.improvement_areas && results.improvement_areas.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Entwicklungspotenziale:
                </Typography>
                <List>
                  {results.improvement_areas.map((area, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <TrendingUp color="info" />
                      </ListItemIcon>
                      <ListItemText primary={area} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App; 