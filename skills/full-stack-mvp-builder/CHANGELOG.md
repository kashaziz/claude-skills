# Changelog - Full-Stack MVP Builder

## Version 1.1 - January 15, 2026

### Major Features Added

#### 🚀 Dual-Mode Execution
- **One-Shot Mode**: Complete codebase generated in 15-20 minutes with minimal user involvement
- **Step-by-Step Mode**: Guided generation with approval after each phase for learning and exploration
- Automatic mode detection based on prompt style and length
- Smart auto-selection for backend and deployment platforms

#### 🤖 Automated Setup
- **setup.sh template**: Automatically installs dependencies, generates secrets, starts database, runs migrations
- **verify.sh template**: Verifies all services are running correctly and database is connected
- Reduces setup time from 30+ minutes to ~5 minutes

#### 📋 Requirements Extraction
- Structured requirements extraction template for One-Shot Mode
- Standardized format for capturing app requirements, resources, relationships, and business rules
- Field type mapping guide for accurate database schema generation
- Auto-selection logic for backend and deployment platforms

### Files Added

1. **REQUIREMENTS_EXTRACTION_GUIDE.md** (3,254 lines)
   - Complete guide for extracting requirements from user prompts
   - Examples for simple and complex applications
   - Field type mapping reference
   - Backend and deployment auto-selection logic

2. **templates/setup.sh.template** (171 lines)
   - Cross-platform setup automation (macOS/Linux)
   - Supports Express, Django, FastAPI, Astro Edge
   - Automatic JWT secret generation
   - Database initialization and migrations

3. **templates/verify.sh.template** (223 lines)
   - Comprehensive verification tests
   - Port checks, health checks, API endpoint tests
   - CORS and database connection verification
   - Colored output with pass/fail summary

4. **templates/README.md** (308 lines)
   - Template usage documentation
   - Variable reference
   - Customization guidelines
   - Testing procedures

5. **CHANGELOG.md** (this file)
   - Version history and changes

### Files Updated

1. **SKILL.md**
   - Added "Choose Your Mode" section at the top
   - Added One-Shot Mode and Step-by-Step Mode documentation
   - Updated sample prompts with mode-specific examples
   - Added comprehensive execution instructions for both modes
   - Updated file index with new documentation

2. **full-stack-mvp-builder-skill.md**
   - Added "0. EXECUTION MODE SELECTION" section
   - Mode detection logic and decision tree
   - Execution patterns for both modes
   - Auto-selection algorithms for backend and deployment

3. **README.md**
   - Added "Choose Your Mode" section
   - Updated examples for both modes
   - Added automated setup instructions with setup.sh
   - Added verification instructions with verify.sh

### Improvements

#### User Experience
- ✅ Clearer mode selection upfront (reduces confusion)
- ✅ Faster setup with automation scripts
- ✅ Better examples with complete field definitions
- ✅ Verification script catches common issues early

#### Developer Experience
- ✅ Standardized requirements extraction
- ✅ Consistent output format across modes
- ✅ Better documentation organization
- ✅ Template-based generation (easier to maintain)

#### Flexibility
- ✅ Users can choose their workflow (fast vs guided)
- ✅ Auto-selection makes defaults smart
- ✅ Step-by-step allows learning and customization
- ✅ One-shot enables rapid prototyping

### Breaking Changes

None. Existing prompts continue to work as before. New features are opt-in.

---

## Version 1.0 - January 14, 2026

Initial release with:
- Phase-by-phase code generation (0.5-9)
- Support for Express, Django, FastAPI, Astro Edge backends
- Astro + Tailwind CSS frontend
- JWT authentication
- PostgreSQL database
- Playwright E2E tests
- Deployment configs for 6 platforms
- Security hardening checklist
- Multi-cloud deployment guide

---

## Migration Guide (1.0 → 1.1)

### For Users

**No action required.** Existing workflows continue to work:

- Old: `"Build a task manager with Express..."`
- New: Still works, treated as Step-by-Step Mode

**To use new features:**
- Prefix with `"One-shot mode:"` for fast generation
- Prefix with `"Step-by-step mode:"` for guided generation

### For Skill Developers

**If you've customized this skill:**

1. Review `REQUIREMENTS_EXTRACTION_GUIDE.md` for the new extraction format
2. Update mode detection logic in your implementation
3. Test both One-Shot and Step-by-Step modes
4. Generate setup.sh and verify.sh scripts in One-Shot Mode

---

## Roadmap

### Upcoming Features (v1.2)

- [ ] Real-world complete examples directory
- [ ] Video walkthroughs for both modes
- [ ] AI-powered requirement refinement
- [ ] Database seeding with realistic data
- [ ] Component library templates (beyond Shadcn/ui)
- [ ] Mobile-responsive preview generation
- [ ] API documentation auto-generation

### Under Consideration

- Support for additional backends (NestJS, Laravel, Ruby on Rails)
- Mobile app generation (React Native, Flutter)
- Desktop app generation (Electron, Tauri)
- Microservices architecture support
- GraphQL API generation
- Real-time features by default (WebSockets)
- Advanced authentication (OAuth, SSO, Magic Links)

---

## Feedback

Found a bug? Have a feature request? Open an issue or submit feedback through Claude.

---

*Last Updated: January 15, 2026*
