# SEO Content Writer Skill - Implementation Guide

## Overview
This guide explains how to set up and use the SEO Content Writer skill in Claude Code.

## What You Get
A powerful content generation skill that:
- Creates SEO-optimized, high-converting content
- Passes AI detection checks (sounds natural and human)
- Asks smart questions to understand your needs
- Provides complete SEO packages (metadata, keywords, linking strategy)
- Adapts to different content types (blogs, landing pages, emails, social media)

## Setup Instructions

### Option 1: Use as a Prompt Template (Recommended for Now)
Since custom skills in Claude Code require configuration, the easiest way to use this is as a reusable prompt:

1. **Copy the skill prompt** from `seo-content-writer.md` (lines 30-end)
2. **Save it** as a reference document
3. **Invoke it** by pasting the prompt when you need content

### Option 2: Create a Custom Skill (Advanced)
To add this as a true `/content` command in Claude Code:

1. **Check Claude Code Documentation** for custom skill setup
2. **Create a skill configuration** (typically in `~/.config/claude/skills/` or project-level)
3. **Register the skill** with the name `seo-content` or `content-writer`
4. **Link the prompt template** from `seo-content-writer.md`

### Option 3: Use with Task Agent
You can invoke this workflow using Claude Code's Task agent:

```bash
# In Claude Code CLI
Task: "Act as an expert SEO content writer. Read skills/seo-content-writer.md and follow its process to create [content type] about [topic]"
```

## Quick Start Usage

### Method 1: Direct Prompt in Chat
In Claude Code, start your request with:

```
Using the SEO content writer workflow from skills/seo-content-writer.md:

Create a [content-type] about [topic] for [audience]
```

Example:
```
Using the SEO content writer workflow from skills/seo-content-writer.md:

Create a blog post about "How to choose project management software for remote teams" for managers evaluating collaboration tools.
```

### Method 2: Explicit Instructions
```
I need SEO-optimized content. Please:
1. Read skills/seo-content-writer.md for the full process
2. Ask me discovery questions
3. Create an outline for approval
4. Write the final content with SEO metadata
5. Provide readability metrics and optimization suggestions

Topic: [your topic]
Type: [blog/landing-page/email/social]
Audience: [your target audience]
```

### Method 3: Reference in Task
```
Create high-converting landing page copy for [YourProduct]'s new feature.
Follow the SEO content writer process in skills/seo-content-writer.md.
Reference planning/content_guide.md for brand voice.
```

## Content Types Supported

### 1. Blog Posts
**Use when**: You want to educate, inform, or rank for specific keywords
**Output**: 800-2000 word article with SEO metadata, headers, internal/external links

**Example request:**
```
Create a blog post using skills/seo-content-writer.md process:
- Topic: "Understanding SaaS Metrics: Your Complete Growth Dashboard Guide"
- Audience: Startup founders, SaaS product managers
- Goal: Educate and drive to analytics platform sign-up
- Tone: Friendly, informative, trustworthy
```

### 2. Landing Pages
**Use when**: You need conversion-focused copy for a product/feature/campaign
**Output**: Sections for hero, benefits, how-it-works, social proof, FAQ, CTA

**Example request:**
```
Create landing page copy using skills/seo-content-writer.md:
- Feature: AI-powered data analysis
- Audience: Business analysts who want faster insights
- Goal: Get users to try AI analysis features
- Tone: Conversational, modern, helpful
```

### 3. Email Campaigns
**Use when**: You need newsletter content, promotional emails, or drip campaigns
**Output**: Subject lines, preheader, body copy, CTA, P.S. line

**Example request:**
```
Create email campaign using skills/seo-content-writer.md:
- Purpose: Welcome new users to [YourProduct]
- Audience: New sign-ups
- Goal: Complete onboarding and first key action
- Tone: Warm, welcoming, encouraging
```

### 4. Social Media Content
**Use when**: You need platform-specific posts that drive engagement
**Output**: Platform-optimized posts with hashtags, hooks, CTAs

**Example request:**
```
Create social media posts using skills/seo-content-writer.md:
- Campaign: "Work Smarter, Not Harder" awareness
- Platforms: Instagram, Twitter, LinkedIn
- Audience: Young professionals and team leads
- Goal: Brand awareness + free trial sign-ups
```

### 5. Product Descriptions
**Use when**: You need compelling copy for products, features, or services
**Output**: Benefit-focused descriptions with features, specs, and CTAs

**Example request:**
```
Create product description using skills/seo-content-writer.md:
- Product: [YourProduct] Pro Plan
- Features: Advanced analytics, priority support, custom integrations
- Audience: Power users who need enterprise features
- Tone: Professional, value-focused
```

## Real-World Examples

### Example 1: Complete Blog Post
```
I need a blog post. Use skills/seo-content-writer.md to:

1. Ask me discovery questions
2. Create an outline
3. Write the full post with SEO optimization

Initial info:
- Topic: "7 Email Marketing Mistakes That Are Killing Your Open Rates"
- Goal: Drive organic traffic + position as email marketing authority
- Audience: Marketing managers struggling with email engagement
- Desired length: 1500-2000 words
- Reference: planning/content_guide.md for brand voice
```

### Example 2: Landing Page Overhaul
```
Using skills/seo-content-writer.md, rewrite our homepage copy:

Current: src/pages/Index.tsx (read this first)
Goal: Increase sign-up rate by 25%
Audience: First-time visitors evaluating collaboration tools
Tone: Friendly, trustworthy, solution-focused
Focus on: Simplicity, power, team productivity
```

### Example 3: Content Refresh
```
Following skills/seo-content-writer.md, refresh this content:

Current: src/pages/About.tsx
Issues: Too formal, not engaging enough
Goal: Make it more relatable and conversion-focused
Audience: People curious about the company's mission
Add: Founder story, company values, CTA to start free trial
```

### Example 4: Multi-Platform Campaign
```
Using skills/seo-content-writer.md, create a coordinated campaign:

Campaign: "Remote Work Productivity Month"
Deliverables:
1. Blog post (1200 words)
2. Email announcement (300 words)
3. Social posts (Instagram, Twitter, LinkedIn)
4. Landing page copy (800 words)

Audience: Remote teams looking to improve collaboration
Goal: Position as essential remote work tool
Tone: Energetic, helpful, timely
```

## Pro Tips

### Get Better Results

1. **Be Specific About Outcomes**
   - Bad: "Write about project management"
   - Good: "Create a blog post that ranks for 'how to choose project management software' and converts readers into trial users"

2. **Provide Context**
   - Share competitor examples
   - Link to your best-performing content
   - Reference brand guidelines (planning/style_guide.md, planning/content_guide.md)

3. **Iterate Smart**
   - Start with outline approval
   - Request multiple headline options
   - Ask for A/B test variants

4. **Leverage Project Knowledge**
   - Always reference planning docs for consistency
   - Mention specific features from the codebase
   - Request integration with existing content

### Common Workflows

#### Workflow 1: New Feature Launch
```
1. Create landing page copy (conversion-focused)
2. Write announcement blog post (SEO-focused)
3. Draft launch email (engagement-focused)
4. Generate social teasers (awareness-focused)
5. Create FAQ content (support-focused)
```

#### Workflow 2: SEO Content Strategy
```
1. Research: Identify keyword opportunities
2. Outline: Create content calendar (10 blog topics)
3. Write: Produce blog posts one by one
4. Optimize: Internal linking between related posts
5. Promote: Repurpose into social content
```

#### Workflow 3: Conversion Optimization
```
1. Audit: Review current landing page copy
2. Identify: Find weak conversion points
3. Rewrite: Create new copy with stronger hooks/CTAs
4. A/B Test: Generate variants for testing
5. Analyze: Recommend improvements
```

## Integration with Your Project

### Quick Access to Brand Guidelines
```
# Read these first before creating content
planning/content_guide.md - Features, messaging, technical details
planning/style_guide.md - Design, colors, typography, brand voice
```

### Common Content Needs
1. **Feature announcements** - New capabilities and updates
2. **Educational content** - Industry guides, best practices, how-tos
3. **User guides** - Tutorials, FAQs, troubleshooting
4. **Marketing copy** - Landing pages, ads, social posts
5. **Community building** - Stories, testimonials, case studies

### Define Your Project Keywords
Before creating content, identify your primary keywords:
- Core product/service terms (e.g., "project management tool")
- Problem-solving keywords (e.g., "team collaboration solutions")
- Feature-specific terms (e.g., "kanban board software")
- Comparison keywords (e.g., "vs [competitor]")
- Use case keywords (e.g., "for remote teams")

## Troubleshooting

### Issue: Content sounds too AI-like
**Solution**: Explicitly request:
- "Use more contractions and casual language"
- "Add personal anecdotes or examples"
- "Vary sentence length more dramatically"
- "Remove any corporate jargon"

### Issue: Too generic, not specific enough
**Solution**: Provide more context:
- Share actual user feedback
- Link to competitor examples
- Describe specific user pain points
- Reference real product features

### Issue: Wrong tone
**Solution**: Give tone examples:
- "Sound like Mailchimp (friendly, witty)"
- "Match the tone in [existing doc]"
- "More professional than casual"
- "Authoritative but approachable"

### Issue: Missing SEO optimization
**Solution**: Explicitly request:
- "Include full SEO metadata package"
- "Suggest 5+ internal linking opportunities"
- "Optimize for keyword: [specific keyword]"
- "Provide schema markup recommendations"

## Next Steps

1. **Try it now**: Pick a content need and use the prompt
2. **Save your favorites**: Keep successful prompts for reuse
3. **Build a library**: Create content templates specific to your needs
4. **Share feedback**: Note what works and improve the process

## Resources

- **Main skill definition**: `skills/seo-content-writer.md`
- **Brand guidelines**: `planning/content_guide.md`, `planning/style_guide.md`
- **SEO reference**: Google's E-E-A-T guidelines, Search Quality Rater Guidelines
- **Writing resources**: Hemingway Editor (readability), Grammarly (grammar), AI detectors

## Support

If you need help:
1. Check this guide for examples
2. Review `skills/seo-content-writer.md` for the full process
3. Start with simpler requests and build complexity
4. Iterate on outputs rather than expecting perfection first try

---

**Remember**: The best content comes from collaboration. The skill asks questions for a reason - thoughtful answers lead to exceptional content!
