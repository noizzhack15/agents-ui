# Story 2.2: Create AI Chat Interface with Prompt Editor - Brownfield Addition

## Status: Draft

## Story

As a user viewing an organization's detail page,
I want to see a ChatGPT-like interface with a greeting "שלום [organization name]" and an editable prompt area,
So that I can comfortably view and edit the organization's prompt in a modern, focused environment.

## Story Context

**Existing System Integration:**

- Integrates with: Angular routing (from Story 2.1), OrganizationService
- Technology: Angular 17, Material UI, Hebrew RTL, Heebo font
- Follows pattern: Material Design cards, standalone components, RTL layout
- Touch points: New org-detail.component, route params, existing service

## Acceptance Criteria

**Functional Requirements:**

1. Detail component loads organization data from route parameter (ID)
2. Organization not found shows appropriate error message
3. Greeting displays: "שלום [organization name]" prominently
4. Prompt is displayed in an editable textarea with RTL support
5. Textarea auto-expands with content (min 200px height)
6. Loading state shown while fetching organization data

**Design Requirements:**

7. AI chat-like interface with clean, spacious layout
8. ChatGPT-inspired design with centered content (max-width: 800px)
9. Greeting section in a distinct card with proper spacing
10. Prompt editor in a separate card below greeting
11. Material Design elevation and shadows applied
12. Hebrew RTL maintained throughout
13. Responsive design works on mobile and desktop
14. Color palette matches existing design system

**Integration Requirements:**

15. Uses existing OrganizationService to fetch data
16. ActivatedRoute used to get ID from URL
17. No modifications to backend API required
18. Reuses global styles and design system
19. Material UI components for consistent look

**Quality Requirements:**

20. Smooth loading transitions
21. No console errors or warnings
22. Proper error handling for missing organizations
23. Accessible keyboard navigation

## Technical Notes

### Integration Approach

**1. Component Architecture:**
```typescript
OrgDetailComponent {
  - Fetch organization by ID from route params
  - Display in ChatGPT-like layout
  - Bind prompt to textarea with two-way binding
  - Handle loading/error states
}
```

**2. Data Flow:**
```
Route Params (ID) 
  → ActivatedRoute.paramMap 
  → OrganizationService.getOrganizations() 
  → Filter by ID 
  → Display organization 
  → Two-way bind to textarea
```

**3. Layout Structure:**
```html
<div class="detail-container">
  <div class="greeting-card">
    <h1>שלום {{ organization.name }}</h1>
  </div>
  
  <div class="prompt-editor-card">
    <label>פרומפט</label>
    <textarea [(ngModel)]="organization.prompt"></textarea>
  </div>
  
  <div class="actions-section">
    <!-- Save button in Story 2.3 -->
  </div>
</div>
```

### Existing Pattern Reference

- Hebrew RTL design from existing components
- Material card-based layout from main list
- Color palette: Primary #1976D2, Background #F5F7FA
- Heebo font for Hebrew text
- Service pattern with BehaviorSubject

### Key Constraints

- Must work with Angular routing from Story 2.1
- Cannot modify OrganizationService logic
- Must maintain Hebrew RTL consistency
- Must follow Material Design patterns
- Textarea must support multi-line Hebrew text with proper alignment

### Design Specifications

**Container Layout:**
```css
.detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  min-height: 100vh;
}
```

**Greeting Card:**
```css
.greeting-card {
  background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
  color: #FFFFFF;
  padding: 32px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

.greeting-card h1 {
  font-size: 36px;
  font-weight: 700;
  margin: 0;
  font-family: 'Heebo', Arial, sans-serif;
}
```

**Prompt Editor Card:**
```css
.prompt-editor-card {
  background: #FFFFFF;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.prompt-textarea {
  width: 100%;
  min-height: 200px;
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Heebo', Arial, sans-serif;
  direction: rtl;
  text-align: right;
  resize: vertical;
  transition: border-color 0.2s ease;
}

.prompt-textarea:focus {
  outline: none;
  border-color: #1976D2;
}
```

**Loading State:**
```html
<div class="loading-container" *ngIf="loading">
  <mat-spinner></mat-spinner>
  <p>טוען...</p>
</div>
```

**Error State:**
```html
<div class="error-container" *ngIf="error">
  <mat-icon>error_outline</mat-icon>
  <h2>ארגון לא נמצא</h2>
  <p>לא מצאנו את הארגון המבוקש</p>
  <button mat-raised-button routerLink="/">חזור לרשימה</button>
</div>
```

### Component Implementation

**org-detail.component.ts:**
```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrganizationService, Organization } from '../services/organization.service';

@Component({
  selector: 'app-org-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './org-detail.component.html',
  styleUrl: './org-detail.component.css'
})
export class OrgDetailComponent implements OnInit {
  organization: Organization | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orgService: OrganizationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadOrganization(id);
      } else {
        this.error = true;
        this.loading = false;
      }
    });
  }

  private loadOrganization(id: string): void {
    this.loading = true;
    this.error = false;

    this.orgService.getOrganizations().subscribe(orgs => {
      const found = orgs.find(o => o._id === id || o.id === id);
      
      if (found) {
        this.organization = { ...found };
        this.loading = false;
      } else {
        this.error = true;
        this.loading = false;
      }
    });
  }
}
```

## Definition of Done

- [ ] Organization detail component created with all imports
- [ ] Route parameter (ID) extracted and used to fetch organization
- [ ] Loading spinner shows while fetching data
- [ ] Error state shows if organization not found
- [ ] "שלום [organization name]" greeting displays in styled card
- [ ] Prompt textarea displays organization's prompt
- [ ] Textarea is editable with two-way binding (ngModel)
- [ ] Textarea supports RTL Hebrew text properly
- [ ] ChatGPT-inspired design with gradients and shadows
- [ ] Responsive design works on mobile (320px+) and desktop
- [ ] Color palette matches existing design system
- [ ] No console errors or warnings
- [ ] Component tested with valid and invalid IDs

## Risk Assessment

### Implementation Risks

- **Primary Risk:** Organization data loading async may cause template errors
- **Mitigation:** Use `*ngIf` guards and proper loading/error states
- **Verification:** Test with slow network, missing data

- **Secondary Risk:** Hebrew text direction in textarea may not work properly
- **Mitigation:** Explicitly set `dir="rtl"` and `text-align: right` on textarea
- **Verification:** Test with multi-line Hebrew text

### Rollback Plan

1. Revert org-detail.component files to placeholder from Story 2.1
2. Keep routing functional but show simple placeholder
3. No impact on other components

### Safety Checks

- [ ] Component isolated, no impact on list page
- [ ] Uses existing service (read-only for this story)
- [ ] No backend changes required
- [ ] Error handling prevents app crashes

## Files to Create/Modify

### New Files (Replace Placeholders from Story 2.1)
- `src/app/pages/org-detail.component.ts` - Full implementation
- `src/app/pages/org-detail.component.html` - AI chat layout
- `src/app/pages/org-detail.component.css` - ChatGPT-inspired styles

### No Modified Files
- Routing and services already in place from Story 2.1

## Testing Strategy

1. **Data Loading:**
   - Navigate to valid organization → loads and displays
   - Navigate to invalid ID → shows error state
   - Refresh page on detail route → loads correctly

2. **UI/Visual:**
   - Greeting shows correct organization name
   - Prompt displays in textarea
   - Design matches ChatGPT aesthetic
   - Hebrew RTL works correctly
   - Responsive on mobile and desktop

3. **Interaction:**
   - Textarea is editable
   - Text direction is RTL
   - Multi-line text works properly
   - Loading spinner shows appropriately

4. **Navigation:**
   - Back to list button works
   - Browser back button works
   - Direct URL access works

## Implementation Notes

### ChatGPT Design Inspiration

- **Gradient Background:** Use blue gradient for greeting card (like ChatGPT's brand)
- **Clean Whitespace:** Generous padding and margins
- **Soft Shadows:** Subtle elevation for depth
- **Rounded Corners:** 12-16px for modern feel
- **Focused Layout:** Max-width container, centered
- **Typography Hierarchy:** Large greeting (36px), medium labels (18px), body text (16px)

### Textarea Auto-Expand (Optional Enhancement)

For Story 2.2, use fixed min-height with `resize: vertical`. 
Future enhancement: Add auto-expand based on content.

### Accessibility Considerations

- Proper label for textarea
- Keyboard navigation works
- Focus states visible
- Color contrast meets WCAG standards
- Screen reader support with aria-labels

### Mobile Responsiveness

```css
@media (max-width: 768px) {
  .detail-container {
    padding: 16px;
  }

  .greeting-card h1 {
    font-size: 28px;
  }

  .greeting-card {
    padding: 24px;
  }
}
```

## Hebrew Text Examples

**Labels:**
- פרומפט - Prompt
- טוען - Loading
- ארגון לא נמצא - Organization not found
- חזור לרשימה - Back to list
- לא מצאנו את הארגון המבוקש - We couldn't find the requested organization

**Textarea Placeholder (Optional):**
```html
<textarea 
  placeholder="הזן את הפרומפט כאן..."
  [(ngModel)]="organization.prompt">
</textarea>
```
