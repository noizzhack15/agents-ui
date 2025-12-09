# Story 2.1: Add Routing and Navigation - Brownfield Addition

## Status: Draft

## Story

As a user,
I want to click on an organization name in the list to navigate to a dedicated detail page,
So that I can view and edit that organization's information in a focused interface.

## Story Context

**Existing System Integration:**

- Integrates with: Angular 17 standalone app (currently single page)
- Technology: Angular Router (built-in), Angular Material, TypeScript
- Follows pattern: Angular standalone component architecture, Material routing
- Touch points: app.config.ts, app.component (refactor to shell), table component

## Acceptance Criteria

**Functional Requirements:**

1. Angular Router is configured with route definitions
2. Main route (`/`) displays the organization list page
3. Detail route (`/:orgId`) displays organization detail page (to be created in Story 2.2)
4. Organization names in the table are clickable links
5. Clicking an organization name navigates to its detail page
6. URL updates to reflect current route (`/` or `/:orgId`)
7. Browser back/forward buttons work correctly

**Integration Requirements:**

8. Existing table functionality continues to work unchanged
9. Add, edit, delete operations remain functional on list page
10. Material UI components adapt to routing without issues
11. No breaking changes to OrganizationService

**Design Requirements:**

12. List page maintains current Hebrew RTL design
13. Navigation is visually clear (organization name styled as link)
14. Hover effects on organization names indicate clickability
15. Router outlet container maintains Hebrew RTL direction

**Quality Requirements:**

16. No console errors related to routing
17. No regression in existing functionality
18. Application loads correctly on both routes
19. Route parameters are properly encoded/decoded

## Technical Notes

### Integration Approach

**1. Router Configuration:**
- Add `provideRouter()` to `app.config.ts`
- Create `app.routes.ts` with route definitions
- Use ID-based routing for safety: `/:id` instead of `/:name`

**2. Component Refactoring:**
- Rename current `app.component` to `org-list.component`
- Create new minimal `app.component` as router shell
- Move list logic to new `org-list.component`

**3. Navigation Implementation:**
- Add `RouterLink` directive to organization names in table
- Use `[routerLink]="['/org', org._id]"` for navigation
- Add CSS to style names as clickable links

**4. Route Structure:**
```typescript
export const routes: Route[] = [
  { path: '', component: OrgListComponent },
  { path: 'org/:id', component: OrgDetailComponent },
  { path: '**', redirectTo: '' }
];
```

### Existing Pattern Reference

- Current app uses Angular 17 standalone components
- Material UI components without routing
- Hebrew RTL layout applied globally via `<html dir="rtl">`
- Service pattern uses BehaviorSubject for state

### Key Constraints

- Must maintain Angular 17 standalone architecture
- Cannot break existing CRUD operations
- Must work with Hebrew RTL layout
- Router must support browser navigation (back/forward)
- URL must be shareable and bookmarkable

### File Structure Changes

**Before:**
```
src/app/
  ├── app.component.ts (contains list logic)
  ├── app.component.html (list template)
  ├── app.component.css (list styles)
  └── app.config.ts
```

**After:**
```
src/app/
  ├── app.component.ts (router shell - NEW)
  ├── app.component.html (router outlet - NEW)
  ├── app.component.css (minimal - NEW)
  ├── app.config.ts (add provideRouter)
  ├── app.routes.ts (route definitions - NEW)
  └── pages/
      ├── org-list.component.ts (refactored from app)
      ├── org-list.component.html (moved from app)
      ├── org-list.component.css (moved from app)
      ├── org-detail.component.ts (placeholder for Story 2.2)
      ├── org-detail.component.html (placeholder)
      └── org-detail.component.css (placeholder)
```

### Implementation Steps

**Step 1: Create Routes File**
```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { OrgListComponent } from './pages/org-list.component';
import { OrgDetailComponent } from './pages/org-detail.component';

export const routes: Routes = [
  { path: '', component: OrgListComponent, title: 'מנהל פרומפטים לארגונים' },
  { path: 'org/:id', component: OrgDetailComponent, title: 'פרטי ארגון' },
  { path: '**', redirectTo: '' }
];
```

**Step 2: Update App Config**
```typescript
// app.config.ts
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes)
  ]
};
```

**Step 3: Create Router Shell**
```typescript
// app.component.ts (new shell)
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
  styles: []
})
export class AppComponent {}
```

**Step 4: Refactor List Component**
- Move current app.component logic to pages/org-list.component
- Add RouterLink directive imports
- Update template to make org names clickable

**Step 5: Create Placeholder Detail Component**
```typescript
// pages/org-detail.component.ts (minimal for Story 2.1)
import { Component } from '@angular/core';

@Component({
  selector: 'app-org-detail',
  standalone: true,
  template: '<div class="container"><h1>Organization Detail (Story 2.2)</h1></div>',
  styles: ['.container { padding: 24px; }']
})
export class OrgDetailComponent {}
```

## Definition of Done

- [ ] `app.routes.ts` created with route definitions
- [ ] `provideRouter()` added to `app.config.ts`
- [ ] App component refactored to router shell with `<router-outlet>`
- [ ] List component moved to `pages/org-list.component`
- [ ] Placeholder detail component created
- [ ] Organization names in table are clickable RouterLinks
- [ ] Navigation to detail route works (shows placeholder)
- [ ] Navigation back to list route works
- [ ] Browser back/forward buttons work correctly
- [ ] All existing CRUD operations work (add, edit, delete)
- [ ] No console errors or warnings
- [ ] Hebrew RTL layout maintained
- [ ] Application tested in Chrome

## Risk Assessment

### Implementation Risks

- **Primary Risk:** Refactoring app.component may break existing functionality
- **Mitigation:** Move code carefully, test each CRUD operation after refactor
- **Verification:** Manual testing of add, edit, delete operations

- **Secondary Risk:** Route parameters with Hebrew characters may cause issues
- **Mitigation:** Use ID-based routing instead of name-based
- **Verification:** Test navigation with various organization IDs

### Rollback Plan

1. Remove `provideRouter()` from `app.config.ts`
2. Delete `app.routes.ts` and `pages/` directory
3. Restore original `app.component` files
4. Restart dev server

### Safety Checks

- [ ] Existing CRUD functionality tested before refactor
- [ ] Changes are incremental and testable
- [ ] Placeholder detail component prevents broken routes
- [ ] Router configuration is minimal and standard

## Files to Modify

### New Files
- `src/app/app.routes.ts` - Route definitions
- `src/app/pages/org-list.component.ts` - Refactored list component
- `src/app/pages/org-list.component.html` - List template
- `src/app/pages/org-list.component.css` - List styles
- `src/app/pages/org-detail.component.ts` - Placeholder detail component
- `src/app/pages/org-detail.component.html` - Placeholder template
- `src/app/pages/org-detail.component.css` - Placeholder styles

### Modified Files
- `src/app/app.config.ts` - Add provideRouter
- `src/app/app.component.ts` - Convert to router shell
- `src/app/app.component.html` - Replace with router-outlet
- `src/app/app.component.css` - Minimal or empty

## Testing Strategy

1. **Navigation Testing:**
   - Click organization name → navigates to detail route
   - Browser back button → returns to list
   - Direct URL access → loads correct route
   - Invalid route → redirects to list

2. **CRUD Operations Testing:**
   - Add organization → modal works, saves, updates list
   - Edit organization → modal works, saves, updates list
   - Delete organization → confirmation works, removes from list

3. **Visual Testing:**
   - List page looks identical to before (Hebrew RTL)
   - Organization names styled as links
   - Hover effects on organization names
   - Router transitions are smooth

4. **Error Testing:**
   - Navigate with invalid ID → redirects gracefully
   - Missing organization → handles error

## Implementation Notes

### RouterLink Syntax for RTL Table

In `org-list.component.html`, update the name column:
```html
<ng-container matColumnDef="name">
  <th mat-header-cell *matHeaderCellDef>אחראי</th>
  <td mat-cell *matCellDef="let element">
    <a [routerLink]="['/org', element._id || element.id]" class="org-name-link">
      {{ element.name }}
    </a>
  </td>
</ng-container>
```

Add to `org-list.component.css`:
```css
.org-name-link {
  color: #1976D2;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
}

.org-name-link:hover {
  color: #1565C0;
  text-decoration: underline;
}
```

### Router Module Imports

Ensure RouterLink is imported:
```typescript
import { RouterLink } from '@angular/router';

@Component({
  // ...
  imports: [CommonModule, MatTableModule, RouterLink, ...]
})
```

### URL Encoding Considerations

- Use organization ID (not name) in URL to avoid encoding issues
- IDs are typically safe strings (MongoDB ObjectId or numeric)
- If using names, apply `encodeURIComponent()` / `decodeURIComponent()`
