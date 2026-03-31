# Video Hero Setup Guide

This guide will help you set up the video assets for the hero section of the Thapa Construction website.

## 📁 Required Files

You need to provide the following files in the `/public` directory:

1. **`/public/videos/construction-hero.webm`** - Primary video (WebM format)
2. **`/public/videos/construction-hero.mp4`** - Fallback video (MP4 format)
3. **`/public/images/hero-video-fallback.jpg`** - Fallback image for mobile devices

---

## 🎥 Video Requirements

### Technical Specifications

- **Duration**: 15-30 seconds (looping video)
- **Resolution**: 1920x1080 (Full HD) minimum
- **Aspect Ratio**: 16:9
- **File Size**: 
  - WebM: **Under 2MB** (preferred)
  - MP4: **Under 4MB** (fallback)
- **Frame Rate**: 24-30 fps
- **No Audio**: Video should not contain audio track

### Content Guidelines

✅ **Recommended Content:**
- Cinematic construction site footage
- Smooth panning shots of completed buildings
- Time-lapse of construction progress
- Professional tools and equipment in action
- Modern architectural exteriors
- Workers in PPE (professional appearance)
- Steady, slow-motion shots

❌ **Avoid:**
- Fast cuts or rapid movements
- Text overlays or watermarks
- Audio/music
- Low-resolution or grainy footage
- Shaky handheld footage
- Distracting elements

---

## 🎬 How to Obtain Video

### Option 1: Stock Video Websites (Recommended)

**Free Sources:**
1. **Pexels Videos** - https://www.pexels.com/videos/
   - Search: "construction site", "building construction", "architecture"
   - Filter by: HD quality, no copyright
   
2. **Pixabay Videos** - https://pixabay.com/videos/
   - Search: "construction", "modern building", "carpentry"
   
3. **Coverr** - https://coverr.co/
   - Category: Business, Architecture

**Premium Sources (if budget allows):**
- Shutterstock
- Adobe Stock
- Storyblocks

### Option 2: Create Your Own

If you have footage from your projects:
1. Use a smartphone or DSLR camera
2. Shoot in landscape mode (16:9)
3. Use a tripod or gimbal for stability
4. Shoot during golden hour (early morning/late afternoon) for best lighting
5. Focus on completed work or active construction sites

---

## 🛠️ Video Optimization Process

### Step 1: Convert to Required Formats

#### Using FFmpeg (Free, Command-line)

Install FFmpeg: https://ffmpeg.org/download.html

**Convert to WebM (highly compressed):**
```bash
ffmpeg -i input-video.mp4 -c:v libvpx-vp9 -b:v 1M -c:a libvorbis -b:a 128k -vf scale=1920:1080 -deadline good -cpu-used 0 construction-hero.webm
```

**Optimize MP4 (fallback):**
```bash
ffmpeg -i input-video.mp4 -c:v libx264 -preset slow -crf 28 -vf scale=1920:1080 -an construction-hero.mp4
```

#### Using Online Tools (Easy)

1. **CloudConvert** - https://cloudconvert.com/
   - Upload video
   - Convert to WebM and MP4
   - Adjust quality settings to reduce file size

2. **HandBrake** (Desktop app) - https://handbrake.fr/
   - Free, user-friendly interface
   - Supports batch conversion

### Step 2: Further Compression (if needed)

If file sizes are still too large:

**Online Compressor:**
- https://www.freeconvert.com/video-compressor
- https://www.videosmaller.com/

**Target file sizes:**
- WebM: 1.5-2MB
- MP4: 3-4MB

---

## 🖼️ Creating the Fallback Image

The fallback image is displayed on mobile devices and when video fails to load.

### Method 1: Extract Frame from Video

Using FFmpeg:
```bash
ffmpeg -i construction-hero.mp4 -ss 00:00:05 -vframes 1 hero-video-fallback.jpg
```

### Method 2: Create Custom Image

1. Take a high-quality photo from your best project
2. Ensure it's horizontal (landscape orientation)
3. Resolution: 1920x1080 or higher
4. Image should be well-lit and professional

### Image Optimization

Use online tools to compress the image:
- **TinyPNG** - https://tinypng.com/
- **Squoosh** - https://squoosh.app/

**Target size:** Under 300KB (ideally 150-200KB)

---

## 📦 File Placement

After obtaining and optimizing the files, place them in the correct directories:

```
public/
├── videos/
│   ├── construction-hero.webm   ← Place WebM video here
│   └── construction-hero.mp4    ← Place MP4 video here
└── images/
    └── hero-video-fallback.jpg  ← Place fallback image here
```

### Quick Setup Commands

```bash
# Navigate to project root
cd "C:\Users\aryan\work space\thapaConstruction"

# Move video files (update paths to your actual files)
Move-Item "path\to\your\video.webm" "public\videos\construction-hero.webm"
Move-Item "path\to\your\video.mp4" "public\videos\construction-hero.mp4"
Move-Item "path\to\your\image.jpg" "public\images\hero-video-fallback.jpg"
```

---

## ✅ Testing Checklist

After adding the video files, test the following:

### Functionality Tests
- [ ] Video plays automatically on desktop (>768px width)
- [ ] Video loops seamlessly without interruption
- [ ] Video is muted (no audio plays)
- [ ] Fallback image displays on mobile devices (<768px width)
- [ ] Fallback image displays if video fails to load
- [ ] Text content is readable over video/image
- [ ] CTAs ("Get Free Quote", "View Projects") link correctly

### Performance Tests
- [ ] Page loads quickly (< 3 seconds on good connection)
- [ ] Lighthouse Performance score > 85
- [ ] Video doesn't block page rendering
- [ ] Mobile users don't download video files
- [ ] Images are properly compressed and optimized

### Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (desktop & mobile)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### Responsive Design
- [ ] Desktop (>1280px) - Video visible, content aligned left
- [ ] Laptop (1024-1280px) - Video visible, content scaled
- [ ] Tablet (768-1024px) - Video visible, trust indicators stack
- [ ] Mobile (375-768px) - Image only, single-column layout
- [ ] Small mobile (320-375px) - All content readable

---

## 🐛 Troubleshooting

### Error 500: "Failed to resolve import /videos/construction-hero.webm"

**Issue**: Dev server fails to start with "Pre-transform error" or "Internal server error"
- **Cause**: Video files don't exist yet, but Vite tries to resolve them at build time
- **Status**: ✅ FIXED - Component now uses runtime resolution
- **Solution**: The component is configured to handle missing videos gracefully. It will:
  1. Attempt to load videos if they exist
  2. Fall back to static image if videos are missing
  3. Not block the dev server from starting

**Current Behavior**: Hero section displays with `hero-home.jpg` as fallback until you add actual video files.

### Video Not Playing

**Issue**: Video doesn't autoplay
- **Solution**: Check browser autoplay policies. Video must be muted for autoplay to work.

**Issue**: Video shows black screen
- **Solution**: Check video codec compatibility. Use H.264 for MP4 and VP9 for WebM.

### Performance Issues

**Issue**: Page loads slowly
- **Solution**: Reduce video file size further. Aim for <2MB total.

**Issue**: High CPU usage
- **Solution**: Video resolution might be too high. Try 1280x720 instead of 1920x1080.

### Mobile Issues

**Issue**: Video loads on mobile despite code
- **Solution**: Clear cache and test in incognito/private mode.

**Issue**: Fallback image not showing
- **Solution**: Check image path and file name match exactly.

---

## 🎨 Customization Options

### Change Video Opacity

Edit `/components/VideoHero.vue`, find the gradient overlay:

```vue
<!-- Current -->
<div class="absolute inset-0 bg-gradient-to-r from-[#1e293b]/95 via-[#1e293b]/85 to-[#1e293b]/70"></div>

<!-- Make darker (more readable) -->
<div class="absolute inset-0 bg-gradient-to-r from-[#1e293b]/98 via-[#1e293b]/90 to-[#1e293b]/80"></div>

<!-- Make lighter (more visible video) -->
<div class="absolute inset-0 bg-gradient-to-r from-[#1e293b]/90 via-[#1e293b]/75 to-[#1e293b]/60"></div>
```

### Update Trust Indicators

Edit trust indicator values in `/components/VideoHero.vue` (Lines 74-133):

```vue
<p class="text-2xl font-bold text-accent">50+</p>
<p class="text-sm text-gray-300">Projects Completed</p>
```

Replace with your actual business statistics.

### Change Colors

The component uses these color variables:
- **Primary Dark**: `#1e293b` (dark blue background)
- **Accent**: `#d4af37` (gold for highlights)

To change, replace all instances in the component file.

---

## 📊 Performance Tips

1. **Lazy Loading**: Video uses `preload="none"` to prevent blocking page load
2. **Conditional Rendering**: Video only loads on desktop to save mobile bandwidth
3. **Connection Speed Detection**: Slow connections automatically use fallback image
4. **Format Priority**: WebM loads first (better compression), MP4 as fallback
5. **Picture-in-Picture Disabled**: Reduces memory usage

---

## 🔄 Future Updates

If you want to change the video later:

1. Replace the video files in `/public/videos/`
2. Keep the same filenames (`construction-hero.webm` and `construction-hero.mp4`)
3. Optionally update the fallback image
4. Clear browser cache for testing
5. Test across devices

No code changes are needed when replacing videos with the same filenames.

---

## 📞 Support

If you encounter any issues during setup:

1. Check that file paths match exactly (case-sensitive on some systems)
2. Verify file formats using a media info tool
3. Test in multiple browsers
4. Check browser console for error messages

---

## ✨ Best Practices

- **Keep videos short** (15-30 seconds) for smaller file sizes
- **Use professional footage** that represents your business quality
- **Test on real mobile devices**, not just browser dev tools
- **Monitor performance** using Lighthouse after deployment
- **Update video seasonally** to keep content fresh (optional)

---

**Setup Date**: March 31, 2026  
**Component Version**: 1.0  
**Last Updated**: March 31, 2026
