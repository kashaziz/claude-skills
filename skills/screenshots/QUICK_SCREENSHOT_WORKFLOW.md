# Quick Screenshot Workflow - TL;DR

## Goal
Capture real app screenshots → Use in Remotion videos as backgrounds

## ⚡ Quick Start (5 Minutes)

### 1. Start Your App
```bash
npm run dev
# App runs at http://localhost:8080
```

### 2. Capture Screenshots

**Browser DevTools Method** (Recommended):
1. Open Chrome DevTools (F12)
2. Enable Device Toolbar (Ctrl+Shift+M / Cmd+Shift+M)
3. Select: iPhone 14 Pro (390 x 844)
4. Navigate through your app flows
5. Capture screenshots: DevTools → ⋮ → Capture screenshot
6. Save to `./screenshots/` folder

**What to Capture**:
- Voice Search: 5 screenshots (empty → permission → listening → transcript → results)
- Manual Search: 5 screenshots (empty → typing → autocomplete → results → detail)
- Scanner: 7 screenshots (homepage → dialog → permission → camera → capture → processing → results)

### 3. Organize & Review
```bash
# Organize by feature
~/.claude/scripts/organize-screenshots.sh

# Review with Claude
/screenshots all
```

### 4. Use in Videos
```bash
# Copy to Remotion
cp screenshots/*.png remotion-videos/src/assets/screenshots/

# Update video code to use screenshots
# Preview in Remotion Studio
cd remotion-videos && npm start

# Re-render
npm run render:all
```

## 📋 Screenshot Checklist

### Voice Search Flow
- [ ] `voice-search-empty.png` - Database page, before clicking voice button
- [ ] `voice-search-permission.png` - Microphone permission dialog
- [ ] `voice-search-listening.png` - Microphone active, pulsing
- [ ] `voice-search-transcript.png` - "You said: E100, E200"
- [ ] `voice-search-results.png` - Results with color-coded badges

### Manual Search Flow
- [ ] `manual-search-empty.png` - Search bar empty
- [ ] `manual-search-typing.png` - Typing "E1" in search
- [ ] `manual-search-autocomplete.png` - Dropdown showing suggestions
- [ ] `manual-search-results.png` - Results table/cards
- [ ] `manual-search-detail.png` - E-code detail page

### Scanner Flow
- [ ] `scanner-homepage.png` - Homepage with scan button
- [ ] `scanner-dialog-open.png` - Scanner dialog modal
- [ ] `scanner-permission.png` - Camera permission dialog
- [ ] `scanner-camera-active.png` - Live camera viewfinder
- [ ] `scanner-capture.png` - After taking photo
- [ ] `scanner-processing.png` - OCR progress bar (45%)
- [ ] `scanner-results-halal.png` - Large "HALAL" status card

## 🛠️ Helper Scripts

```bash
# Automated capture (partial - some manual steps still needed)
node ~/.claude/scripts/capture-app-screenshots.js http://localhost:8080

# Organize screenshots by feature
~/.claude/scripts/organize-screenshots.sh
```

## 📖 Full Documentation

See: `SCREENSHOT_CAPTURE_GUIDE.md`

## ❓ Do You Need a Skill?

**No!** Use the existing `/screenshots` skill to:
- Review captured screenshots
- Verify quality
- Check completeness

```bash
/screenshots all                         # View all
/screenshots pattern "voice-search*.png" # View specific feature
```

## 💡 Pro Tips

1. **Capture at Native Resolution**: Use device mode in DevTools (390x844)
2. **PNG Format**: Better quality, supports transparency
3. **Descriptive Names**: `feature-state-detail.png`
4. **Consistent Timing**: Capture at stable states (not mid-animation)
5. **Use Real Data**: Show actual E-codes and results

## 🎬 Video Integration Example

**Before** (Mockup):
```typescript
<PhoneMockup>
  <div>Generic UI mockup</div>
</PhoneMockup>
```

**After** (Real Screenshot):
```typescript
import scannerCamera from '../assets/screenshots/scanner-camera-active.png';

<PhoneMockup>
  <Img src={scannerCamera} style={{ width: '100%' }} />
</PhoneMockup>
```

## 🚀 Next Steps

1. **Capture**: Take 17 screenshots (5 voice + 5 manual + 7 scanner)
2. **Review**: `/screenshots all`
3. **Organize**: Run organize script
4. **Integrate**: Update Remotion videos
5. **Preview**: Test in Remotion Studio
6. **Render**: Generate final videos

---

**Time Estimate**: 15-30 minutes for complete capture + 30 minutes to integrate into videos
