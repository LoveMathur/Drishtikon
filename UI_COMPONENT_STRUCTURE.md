# UI Component Structure - Ground News Style

## Visual Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                         HEADER BAR                               │
│  [← Back]                                      [Drishtikon Logo] │
└─────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│                    SEARCH SECTION                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Enter topic...                            [Analyze →]  │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│                    AI INSIGHTS SECTION                           │
│  💡 AI Insights                                                  │
│  Analyzing coverage of "Your Topic" across multiple sources...  │
│                                                                  │
│  ● High Consensus Areas                                         │
│    Multiple sources agree on key facts                          │
│                                                                  │
│  ● Areas of Disagreement                                        │
│    Different perspectives on interpretation and impact          │
└─────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────┬─────────────────────────────┐
│   SOURCE COVERAGE (2/3 width)     │  COVERAGE DETAILS (1/3)     │
│                                   │  ┌─────────────────────────┐│
│  👥 Source Coverage               │  │ Coverage Details        ││
│                                   │  ├─────────────────────────┤│
│  ┌─────────────────────────────┐ │  │ Total News Sources:  10 ││
│  │ ▓▓▓▓░░░░▓▓▓▓▓▓▓▓▓          │ │  │                         ││
│  │ [BLUE][GRAY][RED] <-Bias Bar│ │  │ Leaning Left:        3  ││
│  │                             │ │  │ Center:              4  ││
│  │ Article Title Here          │ │  │ Leaning Right:       3  ││
│  │                             │ │  │                         ││
│  │ ● Source Name               │ │  │ Bias Distribution:      ││
│  │ • Left                      │ │  │ ┌───────────────────────┐││
│  │ 📄 5 claims extracted       │ │  │ │33%│  40% │   27%│    │││
│  │              [Read →]       │ │  │ │BLUE│ GRAY │  RED │    │││
│  │                             │ │  │ └───────────────────────┘││
│  │ 33% Left coverage           │ │  │                         ││
│  └─────────────────────────────┘ │  │ Last Updated: Just now  ││
│                                   │  └─────────────────────────┘│
│  ┌─────────────────────────────┐ │  (Sticky - scrolls with you)│
│  │ Another Article Card...     │ │                             │
│  └─────────────────────────────┘ │                             │
│                                   │                             │
│  ● Consensus Claims (7)           │                             │
│  ┌─────────────────────────────┐ │                             │
│  │ ● Widely agreed claim here  │ │                             │
│  │   ✓ Widely agreed upon      │ │                             │
│  └─────────────────────────────┘ │                             │
│                                   │                             │
│  ● Disagreement Claims (10)       │                             │
│  ┌─────────────────────────────┐ │                             │
│  │ ● Disputed claim here       │ │                             │
│  │   ⚠ Limited agreement       │ │                             │
│  └─────────────────────────────┘ │                             │
│                                   │                             │
└───────────────────────────────────┴─────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     TRENDING NOW SECTION                         │
│  [Grid of 4 categories - India, War Room, Parliament, Celebs]   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          FOOTER                                  │
│  [Trending in Borders] [Trending Internationally] [Trending...]  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App.jsx
├── AnimatedHero.jsx (Landing Page)
│   ├── TestimonialsBackground.jsx
│   │   └── Marquee.jsx × 4 columns
│   ├── StaticHeading (memoized)
│   ├── AnimatedWord
│   ├── StaticDescription (memoized)
│   └── ActionButtons (memoized)
│
├── MainContent.jsx (Homepage)
│   ├── Header
│   ├── SearchSection
│   ├── GroundNewsResults.jsx ← NEW!
│   │   ├── AIInsights
│   │   │   └── Lightbulb icon + summaries
│   │   ├── ArticleCard × N
│   │   │   ├── BiasDistributionBar (Red-White-Blue)
│   │   │   ├── ArticleTitle
│   │   │   ├── SourceInfo (with bias dot)
│   │   │   ├── BiasLabel
│   │   │   ├── ClaimsCount
│   │   │   └── ReadLink (external)
│   │   ├── ConsensusClaimsSection
│   │   │   └── ClaimCard × N (green themed)
│   │   ├── DisagreementClaimsSection
│   │   │   └── ClaimCard × N (orange themed)
│   │   └── CoverageDetails (sidebar, sticky)
│   │       ├── TotalSources
│   │       ├── BiasBreakdown (Left/Center/Right counts)
│   │       └── VisualDistributionBar
│   ├── TrendingCategories
│   │   └── TrendingCategory × 4 (clickable)
│   └── Footer
│
└── TrendingPage.jsx
    ├── Header
    ├── TrendingCategories × 4 (clickable stories)
    │   └── Story × N (with onClick handlers)
    └── Footer
```

## Color Coding System

### Bias Colors (Following Ground News)
```
LEFT (Liberal)      CENTER (Neutral)    RIGHT (Conservative)
────────────────    ────────────────    ────────────────────
🔵 Blue #3B82F6     ⚪ Gray #9CA3AF     🔴 Red #EF4444

Used for:           Used for:           Used for:
- Bias bars         - Bias bars         - Bias bars
- Indicator dots    - Indicator dots    - Indicator dots
- Labels            - Labels            - Labels
```

### Consensus Levels
```
HIGH CONSENSUS      MEDIUM CONSENSUS    LOW CONSENSUS
──────────────      ────────────────    ─────────────
🟢 Green #10B981   🟡 Yellow #F59E0B   🔴 Red #EF4444
```

### UI Accents
```
PRIMARY             SECONDARY           CONSENSUS          DISAGREEMENT
────────            ─────────           ─────────          ────────────
🟠 Orange #F97316  💗 Pink #EC4899     🟢 Green          🟠 Orange
```

## Data Flow

```
User Action → API Call → Backend Processing → Frontend Display

1. USER SEARCHES TOPIC
   ↓
2. MainContent.handleAnalyze()
   ↓
3. POST /api/analyze
   ↓
4. Backend Pipeline:
   - Fetch from 3 APIs (NewsAPI, GNews, NewsData)
   - Classify bias per article
   - Extract claims with LLM
   - Generate embeddings
   - Cluster similar claims
   - Analyze consensus
   ↓
5. Return JSON:
   {
     articles: [...],           ← Article cards
     consensus_claims: [...],   ← Green section
     disagreement_claims: [...],← Orange section
     consensus_summary: {...},  ← AI insights
     article_count: N,          ← Sidebar stats
     ...
   }
   ↓
6. GroundNewsResults receives data
   ↓
7. Calculate bias distribution
   ↓
8. Render components:
   - AI Insights at top
   - Article cards with bias bars
   - Consensus claims (green)
   - Disagreement claims (orange)
   - Coverage sidebar (sticky)
```

## Interaction Patterns

### Article Card Interaction
```
[Hover State]
- Card background: bg-white/5 → bg-white/10
- Title color: white → orange-400
- Cursor: pointer

[Click "Read" Link]
- Opens in new tab (target="_blank")
- External link icon visible
- Event propagation stopped
```

### Trending Story Interaction
```
[Hover State]
- Border: border-white/20 → border-orange-500/50
- Text: text-white/90 → text-orange-400

[Click Story]
1. Show "Analyzing..." indicator
2. Call onAnalyzeTopic(story.title)
3. Navigate to homepage (App level)
4. Auto-fill topic input
5. Auto-trigger analysis
6. Display results
```

## Responsive Behavior

### Desktop (lg: 1024px+)
```
┌─────────────────────────────┬───────────┐
│  Articles (66%)             │ Sidebar   │
│  - AI Insights              │  (33%)    │
│  - Article Cards            │           │
│  - Consensus Claims         │ [Sticky]  │
│  - Disagreement Claims      │           │
└─────────────────────────────┴───────────┘
```

### Tablet/Mobile (< 1024px)
```
┌─────────────────────────────┐
│  Articles (100%)            │
│  - AI Insights              │
│  - Article Cards            │
│  - Consensus Claims         │
│  - Disagreement Claims      │
└─────────────────────────────┘
┌─────────────────────────────┐
│  Sidebar (100%)             │
│  [No longer sticky]         │
└─────────────────────────────┘
```

## Performance Optimizations

### Previous (Maintained)
- ✅ React.memo on static components
- ✅ useCallback for event handlers
- ✅ GPU-accelerated animations
- ✅ Fixed container heights
- ✅ No layout shifts

### New
- ✅ Bias distribution calculated once
- ✅ CSS sticky positioning (no JS)
- ✅ Efficient map() iterations
- ✅ No unnecessary re-renders

## File Locations

```
/frontend/src/
├── components/
│   ├── GroundNewsResults.jsx ← NEW - Main results component
│   ├── MainContent.jsx        ← MODIFIED - Integrated new results
│   ├── TrendingPage.jsx       ← MODIFIED - Clickable stories
│   ├── AnimatedHero.jsx       ← Existing - Landing page
│   ├── Footer.jsx             ← Existing
│   └── ui/
│       ├── Card.jsx           ← Used by GroundNewsResults
│       ├── Avatar.jsx
│       └── Marquee.jsx
├── App.jsx                    ← MODIFIED - Topic passing
└── index.css                  ← GPU optimizations from prev sessions
```

## Testing Workflow

```
1. Start Backend
   cd /home/kirmaada/Projects/Drishtikon
   source venv/bin/activate
   uvicorn app.main:app --reload --port 8001

2. Start Frontend
   cd frontend
   npx vite

3. Test Flow
   http://localhost:5173
   ↓
   Click "Homepage"
   ↓
   Search: "India elections"
   ↓
   Verify:
   - AI Insights section
   - Article cards with bias bars
   - Sidebar statistics
   - Both consensus and disagreement
   - Clickable "Read" links
   ↓
   Click "Trending"
   ↓
   Click any story
   ↓
   Verify:
   - Auto-navigate to homepage
   - Auto-analyze topic
   - Results display
```

---

**Status**: All components implemented and integrated  
**Visual Style**: Ground News-inspired professional layout  
**Responsiveness**: Mobile-first, progressive enhancement  
**Performance**: 60fps animations, efficient rendering
