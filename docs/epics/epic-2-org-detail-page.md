# Epic 2: Organization Detail Page with AI Chat Interface - Brownfield Enhancement

## Epic Goal
Create a dedicated page for each organization (route: `/[organization-name]`) with an AI chat-like interface where users can view and edit the organization's prompt, with a welcoming "שלום [שם]" greeting similar to ChatGPT.

## Epic Description

**Existing System Context:**
- Angular 17 app with Material UI
- Main list page already displays organizations with CRUD operations
- Hebrew RTL layout with modern design implemented
- Backend API: `http://35.225.79.109:3000/api/agents`
- Data model: `{ _id?, id?, name, prompt }`
- No routing currently configured (single page app)

**Enhancement Details:**
- Add Angular Router for navigation between pages
- Create organization detail page accessible via `/[organization-name]` route
- Design AI chat-like interface with greeting: "שלום [organization name]"
- Display organization's prompt in an editable textarea/input
- Add "שמור" (Save) button to persist changes
- Implement clean, ChatGPT-inspired UI with Hebrew RTL support
- Navigate from main list to detail page by clicking organization name

## Stories

1. **Story 2.1: Add Routing and Navigation**
   - Configure Angular Router with routes
   - Create main list route (`/`) and detail route (`/:orgName`)
   - Make organization names in the table clickable to navigate to detail page
   - Add back button/navigation from detail to list

2. **Story 2.2: Create AI Chat Interface Component**
   - Build organization detail component with AI chat-like layout
   - Display "שלום [organization name]" greeting
   - Show editable prompt textarea/editor
   - Apply ChatGPT-inspired design with Hebrew RTL
   - Implement responsive design

3. **Story 2.3: Implement Save Functionality**
   - Add "שמור" (Save) button
   - Connect to existing OrganizationService.updateOrganization()
   - Show loading state during save
   - Display success/error feedback
   - Handle navigation after save (stay on page or return to list)

## Compatibility Requirements
- Maintain existing main list page functionality
- No breaking changes to current CRUD operations
- Backend API remains unchanged
- Existing OrganizationService reused for data operations
- Hebrew RTL design consistency maintained
- Material UI design system continues

## Risk Mitigation
- **Primary Risk:** Routing breaks existing single-page functionality
- **Mitigation:** Test navigation thoroughly, maintain list page as default route
- **Verification:** Ensure all existing CRUD operations still work after routing added

- **Secondary Risk:** Organization name in URL may have special characters
- **Mitigation:** Use URL-safe encoding/decoding, or use ID-based routing with name display
- **Verification:** Test with various organization names including Hebrew characters

### Rollback Plan
1. Remove router configuration from `app.config.ts`
2. Delete new detail component and route
3. Restore original app.component as main component
4. Remove navigation links from table

### Safety Checks
- [ ] Existing list page functionality tested before changes
- [ ] All changes are isolated to routing and new detail component
- [ ] Backend API calls remain unchanged
- [ ] Existing OrganizationService logic remains unchanged
- [ ] Hebrew RTL design maintained

## Technical Architecture

### Routing Strategy
- Use Angular Router with route parameters
- Route pattern: `/:orgName` or `/:orgId` (recommend ID for safety)
- Route guards not needed (no authentication yet)
- Lazy loading not needed for small app

### Component Structure
```
/src/app/
  ├── pages/
  │   ├── org-list.component.ts (refactor from app.component)
  │   ├── org-list.component.html
  │   ├── org-list.component.css
  │   ├── org-detail.component.ts (NEW)
  │   ├── org-detail.component.html (NEW)
  │   └── org-detail.component.css (NEW)
  ├── app.component.ts (becomes router outlet container)
  ├── app.config.ts (add provideRouter)
  └── app.routes.ts (NEW - route definitions)
```

### Design Specifications for AI Chat Interface

**Layout:**
- Full-width container with max-width: 800px centered
- Top section: Greeting card with "שלום [name]"
- Middle section: Prompt editor card
- Bottom section: Action buttons

**Greeting Section:**
- Large, friendly greeting: "שלום [organization name]"
- Subtitle or description (optional)
- Icon or avatar (optional)

**Prompt Editor:**
- Multi-line textarea with RTL support
- Min-height: 200px, auto-expand
- Placeholder text in Hebrew
- Character count indicator (optional)
- Syntax highlighting or formatting tools (future enhancement)

**Action Buttons:**
- Primary: "שמור" (Save) button - Material Blue
- Secondary: "ביטול" (Cancel/Back) button
- Loading indicator on save
- Success/error toast notifications

**Color Palette (maintain consistency):**
- Same as existing: Primary #1976D2, Accent #FF4081
- Card backgrounds: #FFFFFF
- Success feedback: #4CAF50

## Definition of Done

- [ ] Angular Router configured with routes
- [ ] Organization list page refactored as routable component
- [ ] Organization detail page created with AI chat interface
- [ ] Navigation from list to detail works (clickable org names)
- [ ] Navigation from detail back to list works
- [ ] "שלום [organization name]" greeting displays correctly
- [ ] Prompt editor is editable with RTL support
- [ ] "שמור" button saves changes via existing API
- [ ] Loading states and feedback implemented
- [ ] Responsive design works on mobile and desktop
- [ ] Hebrew RTL design consistency maintained
- [ ] All existing CRUD operations still work
- [ ] No console errors or warnings
- [ ] Application tested in Chrome, Firefox, Edge

## Validation Checklist

- [ ] Epic can be completed in 3 focused stories
- [ ] Enhancement follows existing patterns (Material UI, Hebrew RTL)
- [ ] Integration complexity is manageable (simple routing)
- [ ] Risk to existing system is low (additive changes)
- [ ] Rollback plan is feasible
- [ ] Testing approach covers routing and CRUD
- [ ] Epic goal is clear and achievable
- [ ] Stories are properly scoped and sequenced
- [ ] Success criteria are measurable
- [ ] Dependencies are identified (none blocking)

## Dependencies

**Technical:**
- Angular Router (already included in Angular 17)
- Existing OrganizationService
- Existing Material UI components
- Hebrew font (Heebo) already loaded

**Story Dependencies:**
- Story 2.1 must complete before 2.2 (routing needed for navigation)
- Story 2.2 must complete before 2.3 (UI needed for save functionality)
- Linear execution: 2.1 → 2.2 → 2.3

## Success Metrics

- Users can navigate to individual organization pages via URL
- Prompt editing experience is smooth and ChatGPT-like
- Save operation completes successfully
- Navigation between pages works seamlessly
- Design maintains Hebrew RTL consistency and modern aesthetic
