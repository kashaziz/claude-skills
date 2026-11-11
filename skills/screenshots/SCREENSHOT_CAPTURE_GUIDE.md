# Screenshot Capture for Demo Videos - Complete Guide

## Goal

Capture real screenshots of your app's scanning/uploading process to use as backgrounds in your Remotion product demo videos instead of simple mockups.

## Two Approaches

### Approach 1: Manual Capture (Recommended for Best Quality)

**Pros**:
- Full control over timing and framing
- Can capture camera/microphone permissions
- Can capture actual device-specific UI
- Better quality for final videos

**Cons**:
- Takes more time
- Need to manually trigger each state

### Approach 2: Automated Capture (Faster, Some Manual Steps Needed)

**Pros**:
- Faster for standard UI states
- Consistent framing
- Repeatable process

**Cons**:
- Can't capture permissions dialogs
- Can't trigger camera/microphone
- May miss edge cases

## Complete Workflow

### Step 1: Prepare Your App

```bash
# Start your development server
npm run dev

# Or use mobile preview
npm run dev:mobile

# App should be running on http://localhost:8080
```

### Step 2A: Manual Screenshot Capture

#### Using Browser DevTools (Recommended)

1. **Open DevTools** (F12 or Right-click → Inspect)

2. **Enable Device Toolbar** (Ctrl+Shift+M / Cmd+Shift+M)

3. **Select Device**: iPhone 14 Pro (390 x 844)

4. **Capture Screenshots**:
   - **Chrome**: DevTools → More Tools → Capture screenshot
   - **Firefox**: Right-click page → Take Screenshot
   - **Safari**: Develop → Show Web Inspector → Screenshot

#### What to Capture

**Voice Search Flow** (5 screenshots):
```
1. voice-search-empty.png
   - Navigate to /ecodes-database
   - Before clicking voice button

2. voice-search-permission.png
   - After clicking "Voice Search" button
   - Microphone permission dialog visible

3. voice-search-listening.png
   - After granting permission
   - Microphone active, pulsing animation

4. voice-search-transcript.png
   - After speaking (e.g., "E100, E200")
   - Transcript visible: "You said: ..."

5. voice-search-results.png
   - Results displayed with status badges
   - Color-coded list visible
```

**Manual Search Flow** (5 screenshots):
```
1. manual-search-empty.png
   - Database page, search bar empty
   - Status statistics visible

2. manual-search-typing.png
   - Typing "E1" in search bar
   - Focus state visible

3. manual-search-autocomplete.png
   - Autocomplete dropdown showing
   - "E100 - Curcumin" suggestion visible

4. manual-search-results.png
   - Search results table/cards
   - Multiple E-codes with status dots

5. manual-search-detail.png
   - Individual E-code detail page
   - Full description and status badge
```

**Image Scanning Flow** (7 screenshots):
```
1. scanner-homepage.png
   - Homepage with "Scan Label" button
   - Hero section visible

2. scanner-dialog-open.png
   - Scanner dialog modal open
   - Camera and Upload options visible

3. scanner-permission.png
   - Camera permission dialog
   - Browser asking for camera access

4. scanner-camera-active.png
   - Live camera viewfinder
   - Corner brackets visible
   - Product label in frame

5. scanner-capture.png
   - After capturing photo
   - Image displayed in viewfinder

6. scanner-processing.png
   - OCR processing animation
   - Progress bar showing 45%
   - Status text: "Extracting text..."

7. scanner-results-halal.png
   - Large "HALAL" status card
   - Extracted E-codes listed
   - All green status indicators
```

#### Save Location

Save all screenshots to:
```bash
./screenshots/
```

With the naming convention shown above.

### Step 2B: Automated Capture (Partial)

```bash
# Install Puppeteer (one-time)
npm install -g puppeteer

# Run the script
node ~/.claude/scripts/capture-app-screenshots.js http://localhost:8080 ./screenshots

# This captures standard UI states
# You still need to manually capture:
# - Permission dialogs
# - Camera/microphone active states
# - Processing animations
```

### Step 3: Review Screenshots with `/screenshots` Skill

```bash
# In Claude Code

# Review voice search screenshots
/screenshots pattern "voice-search*.png"

# Review manual search screenshots
/screenshots pattern "manual-search*.png"

# Review scanner screenshots
/screenshots pattern "scanner*.png"

# Review all
/screenshots all
```

I'll help you:
- Verify you captured all needed states
- Check image quality (resolution, clarity)
- Suggest improvements or missing shots
- Validate they're suitable for video backgrounds

### Step 4: Integrate Screenshots into Remotion Videos

Now update your Remotion videos to use real screenshots instead of mockups.

#### Option A: Simple Background Images

Update each video to use screenshots as backgrounds:

**Example for Video 1 (Voice Search)**:

```typescript
// remotion-videos/src/Video1-VoiceSearch.tsx

import voiceSearchEmpty from '../assets/screenshots/voice-search-empty.png';
import voiceSearchListening from '../assets/screenshots/voice-search-listening.png';
import voiceSearchResults from '../assets/screenshots/voice-search-results.png';

const FeatureDemo: React.FC = () => {
  // ... existing code ...

  return (
    <AbsoluteFill>
      {/* Show actual screenshot instead of mockup */}
      {frame < 60 && (
        <Img
          src={voiceSearchEmpty}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      )}

      {frame >= 60 && frame < 150 && (
        <Img
          src={voiceSearchListening}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      )}

      {frame >= 150 && (
        <Img
          src={voiceSearchResults}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      )}
    </AbsoluteFill>
  );
};
```

#### Option B: Screenshots in Phone Mockup

Keep the phone mockup design but use real screenshots inside:

```typescript
<PhoneMockup scale={1.8}>
  {/* Real screenshot as background */}
  <Img
    src={voiceSearchListening}
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }}
  />
</PhoneMockup>
```

#### Option C: Hybrid Approach (Best)

Use real screenshots with animated overlays:

```typescript
<AbsoluteFill>
  {/* Real screenshot as base */}
  <Img src={scannerCamera} style={{ width: '100%', objectFit: 'contain' }} />

  {/* Animated overlays on top */}
  {frame >= 100 && (
    <div style={{
      position: 'absolute',
      bottom: '20%',
      left: '50%',
      transform: 'translateX(-50%)',
      opacity: interpolate(frame, [100, 120], [0, 1])
    }}>
      <ProgressBar startFrame={100} />
    </div>
  )}
</AbsoluteFill>
```

### Step 5: Copy Screenshots to Remotion Project

```bash
# Copy screenshots to Remotion assets
cp screenshots/voice-search*.png remotion-videos/src/assets/screenshots/
cp screenshots/manual-search*.png remotion-videos/src/assets/screenshots/
cp screenshots/scanner*.png remotion-videos/src/assets/screenshots/
```

Or create symlinks:
```bash
# Link entire folder
ln -s ../../screenshots remotion-videos/src/assets/screenshots
```

### Step 6: Test Videos with Real Screenshots

```bash
cd remotion-videos

# Preview in studio
npm start

# Navigate to each video composition
# Verify screenshots display correctly
# Check timing and transitions
```

### Step 7: Re-render Final Videos

```bash
# Render all videos with real screenshots
npm run render:all

# Check output
ls -lh output/
```

## Best Practices

### Screenshot Quality

**Resolution**:
- Minimum: 1080px width (for vertical videos)
- Recommended: Device resolution (390x844 for iPhone 14 Pro)
- Maximum: Actual device pixel ratio

**Format**:
- PNG for UI screenshots (lossless, transparency)
- JPEG for photos (smaller file size)

**File Size**:
- Compress if > 1MB per screenshot
- Use tools like TinyPNG or ImageOptim

### Timing Your Captures

**For Animations**:
- Capture at peak animation state (not mid-transition)
- Get the "hero moment" of each flow

**For Dialogs**:
- Center dialogs in frame
- Ensure full visibility (no cut-off edges)

**For Lists/Results**:
- Show enough items to demonstrate (3-5)
- Avoid empty or overly crowded states

### Naming Convention

Use descriptive, sortable names:
```
[feature]-[state]-[detail].png

Examples:
voice-search-01-empty.png
voice-search-02-permission.png
voice-search-03-listening.png

scanner-01-dialog.png
scanner-02-camera.png
scanner-03-processing.png
```

### Organizing by Feature

```
screenshots/
├── voice-search/
│   ├── 01-empty.png
│   ├── 02-permission.png
│   ├── 03-listening.png
│   ├── 04-transcript.png
│   └── 05-results.png
├── manual-search/
│   ├── 01-empty.png
│   ├── 02-typing.png
│   ├── 03-autocomplete.png
│   ├── 04-results.png
│   └── 05-detail.png
└── scanner/
    ├── 01-homepage.png
    ├── 02-dialog.png
    ├── 03-permission.png
    ├── 04-camera.png
    ├── 05-capture.png
    ├── 06-processing.png
    └── 07-results.png
```

## Tools Reference

### Browser Screenshot Tools

**Chrome DevTools**:
```
F12 → Device Toolbar (Ctrl+Shift+M) → More Tools → Capture screenshot
```

**Firefox**:
```
F12 → Settings → Take a screenshot of the page
```

**Safari**:
```
Develop → Show Web Inspector → Screenshot
```

### OS Screenshot Tools

**macOS**:
```
Cmd+Shift+4           # Select area
Cmd+Shift+4, Space    # Capture window
Cmd+Shift+5           # Advanced options
```

**Windows**:
```
Win+Shift+S           # Snipping tool
Win+PrtScn            # Full screen
```

**Linux**:
```
gnome-screenshot      # GNOME
spectacle             # KDE
```

### Browser Extensions

**Recommended**:
- Awesome Screenshot
- Nimbus Screenshot
- GoFullPage (for full-page captures)

## Troubleshooting

### Screenshot Blurry in Videos

**Problem**: Screenshots look pixelated when rendered
**Solution**:
- Increase screenshot resolution (use 2x device pixel ratio)
- Use PNG format (lossless)
- Check Remotion render quality settings

### Camera/Microphone Screenshots Not Captured

**Problem**: Automated script can't trigger permissions
**Solution**:
- These must be captured manually
- Use real device or browser DevTools
- Trigger permission flow manually, then screenshot

### Screenshots Have Wrong Aspect Ratio

**Problem**: Screenshots stretched or cropped in videos
**Solution**:
- Match screenshot dimensions to video dimensions (1080x1920)
- Use `objectFit: 'contain'` in video code
- Crop screenshots to exact size before importing

### Colors Look Different in Video

**Problem**: Screenshots colors don't match rendered video
**Solution**:
- Check color space (sRGB recommended)
- Verify video codec settings
- Test render quality setting

## Next Steps After Capturing

1. **Review with `/screenshots`**:
   ```bash
   /screenshots all
   ```

2. **Organize by Feature**:
   ```bash
   mkdir -p screenshots/{voice-search,manual-search,scanner}
   mv screenshots/voice-* screenshots/voice-search/
   # etc.
   ```

3. **Copy to Remotion**:
   ```bash
   cp -r screenshots/ remotion-videos/src/assets/
   ```

4. **Update Video Code**: Integrate screenshots into compositions

5. **Preview**: Test in Remotion Studio

6. **Render**: Generate final videos

7. **Compare**: Old (mockup) vs New (real screenshots)

## Summary

**Quick Start** (Manual):
1. Run `npm run dev`
2. Open browser DevTools, enable device mode
3. Navigate through each flow
4. Take screenshots at each key state
5. Save to `./screenshots/` with descriptive names
6. Review with `/screenshots all`
7. Copy to Remotion and update videos

**With Automation**:
1. `node ~/.claude/scripts/capture-app-screenshots.js`
2. Manually capture permission/camera states
3. Review with `/screenshots all`
4. Copy to Remotion and update videos

**Using in Videos**:
- Import screenshots as images
- Replace mockup UI with real screenshots
- Add animated overlays if needed
- Re-render videos

---

**Ready to capture!** Start with manual screenshots for best results, or use the automation script for speed.
