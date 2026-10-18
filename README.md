# Saurav Kumar — AEM Developer Portfolio Website

A modern, responsive, interactive portfolio website built for **Saurav Kumar** (*AEM Developer | AEM DAM & AEM Assets (AEMaaCS)*).

## Project Folder Structure

```
saurav-kumar-portfolio/
├── index.html                           # Main portfolio entry point
├── css/
│   └── styles.css                       # Custom glassmorphism, theme variables & print styles
├── js/
│   ├── data.js                          # Structured resume data, AEM code blueprints & Oak query scenarios
│   └── app.js                           # UI state, filters, Chart.js graph, Oak Index simulator & modals
├── assets/
│   ├── hero-architecture.jpg            # 3D isometric AEM cloud & DAM pipeline visual
│   ├── developer-emblem.jpg             # Developer emblem badge
│   └── Saurav_Kumar_AEM_Dev_Resume.pdf  # Original attached resume PDF
├── package.json                         # Optional static server scripts
└── README.md                            # Setup and deployment guide
```

## Key Features

1. **Hero & Executive Summary**: Highlights 5+ years of AEM expertise (1+ year AEMaaCS at Capgemini, 4+ years AEM 6.5 On-Premise at Aventior Digital & Wipro Limited).
2. **Interactive Technical Skills & Code Inspector**: Filter skills across *AEM Platforms*, *AEM & Backend Stack*, *Front-End*, *Build/Tools*, and *Analytics (GA4/GTM)*, and inspect real-world implementation snippets.
3. **Interactive Career Timeline**: Filterable by environment (`All`, `AEMaaCS`, `AEM 6.5`) and searchable by keyword.
4. **AEM Architectural Blueprints**: Inspect production-style code blueprints (`DamAssetLifecycleProcess.java`, `_oak_index/damAssetLucene-10-custom-2/.content.xml`, `EnterpriseFeatureCardModel.java`, and `analytics-datalayer-bridge.js`).
5. **JCR Query & Oak Index Optimization Simulator**: Compare *Unindexed Traversal*, *Property Index*, and *AEMaaCS Custom Lucene Index* query plans across real enterprise DAM & Sites queries.
6. **Dark / Light Theme & Printable CV Modal**: Built-in theme switcher and printable resume view.

## Running Locally

Simply open `index.html` in any modern browser, or serve the folder via Python/Node:

```bash
# Using Python 3
python3 -m http.server 8080

# Or using npx serve
npx serve .
```
