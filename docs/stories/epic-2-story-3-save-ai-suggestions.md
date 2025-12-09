# Story 2.3: Save Functionality with AI Prompt Suggestions - Brownfield Addition

## Status: Complete

## Story

As a user editing an organization's prompt,
I want to save my changes and automatically receive AI-powered suggestions for improvement,
So that I can persist my updates and then choose to enhance the prompt with AI assistance.

## Story Context

**Existing System Integration:**

- Integrates with: org-detail.component (Story 2.2), OrganizationService
- Technology: Angular 17, Material UI, Hebrew RTL, HTTP service
- Follows pattern: Async operations with loading states, Hebrew UI labels
- Touch points: Backend API PUT endpoint, new suggestion API endpoint

## Acceptance Criteria

**Save Functionality Requirements:**

1. "שמור" (Save) button visible and enabled when prompt is modified
2. Clicking save calls `OrganizationService.updateOrganization()`
3. Loading state on save button while API call in progress
4. Save button disabled during save or suggestion loading
5. Error handling: "שגיאה בשמירה" (Save error) snackbar message
6. Track original vs modified prompt to enable/disable save

**AI Suggestion Flow (Auto-triggered):**

7. After successful save, automatically call suggestion API
8. Loading state displays: "מקבל הצעה משופרת..." (Getting improved suggestion...)
9. API call: `POST /api/suggestions` with `{ prompt: string }`
10. Suggestion displays in yellow card with lightbulb icon below prompt editor
11. Suggestion card shows: "הצעה משופרת" title + suggested text + action buttons
12. Two buttons: "אשר הצעה" (Approve Suggestion) and "דחה הצעה" (Decline Suggestion)
13. Clicking "אשר הצעה" replaces prompt with suggestion, shows success snackbar, and **automatically saves again**
14. Clicking "דחה הצעה" hides suggestion card and shows dismissal snackbar
15. Error handling if suggestion API fails (show Hebrew error message, don't block user)

**State Management:**

16. Save marks current prompt as saved state
17. Accepting suggestion marks prompt as modified again (enables save button)
18. Declining suggestion just dismisses card (no state change)
19. Only one suggestion shown at a time
20. Suggestion loading state prevents saving during fetch

**Integration Requirements:**

21. Uses existing `OrganizationService.updateOrganization()` method
22. New service method: `getSuggestion(prompt: string): Observable<{ suggestion: string }>`
23. API endpoint: `POST /api/suggestions` (currently mocked, ready for backend)
24. Maintains Hebrew RTL and ChatGPT-inspired design
25. Material snackbar for all feedback messages

**Quality Requirements:**

26. No duplicate save requests (disable button during save)
27. Save success shown: "נשמר בהצלחה" snackbar
28. Suggestion approval: "ההצעה אושרה" snackbar
29. Suggestion decline: "ההצעה נדחתה" snackbar
30. Proper loading states prevent user confusion
31. Error messages are clear and actionable

## Technical Notes

### New API Endpoint Specification

**Request:**
```typescript
POST http://35.225.79.109:3000/api/suggestions
Content-Type: application/json

{
  "prompt": "existing prompt text..."
}
```

**Response:**
```typescript
{
  "suggestion": "AI-improved prompt text..."
}
```

**Error Response:**
```typescript
{
  "error": "Error message"
}
```

### Service Method Addition

Add to `OrganizationService`:

```typescript
getSuggestion(prompt: string): Observable<{ suggestion: string }> {
  return this.http.post<{ suggestion: string }>(
    `${this.apiUrl}/suggestions`,
    { prompt }
  );
}
```

### Component State Management

```typescript
export class OrgDetailComponent {
  organization: Organization | null = null;
  originalPrompt: string = '';
  suggestion: string | null = null;
  loadingSuggestion = false;
  saving = false;
  
  get isModified(): boolean {
    return this.organization?.prompt !== this.originalPrompt;
  }
  
  getSuggestion(): void {
    if (!this.organization?.prompt) return;
    
    this.loadingSuggestion = true;
    this.orgService.getSuggestion(this.organization.prompt)
      .subscribe({
        next: (response) => {
          this.suggestion = response.suggestion;
          this.loadingSuggestion = false;
        },
        error: (err) => {
          this.showError('שגיאה בקבלת הצעה');
          this.loadingSuggestion = false;
        }
      });
  }
  
  acceptSuggestion(): void {
    if (this.suggestion && this.organization) {
      this.organization.prompt = this.suggestion;
      this.suggestion = null; // Clear suggestion after accepting
    }
  }
  
  rejectSuggestion(): void {
    this.suggestion = null;
  }
  
  save(): void {
    if (!this.organization || this.saving) return;
    
    this.saving = true;
    this.orgService.updateOrganization(this.organization)
      .subscribe({
        next: () => {
          this.originalPrompt = this.organization!.prompt;
          this.saving = false;
          this.showSuccess('נשמר בהצלחה');
          // Optional: navigate back
          // this.router.navigate(['/']);
        },
        error: (err) => {
          this.saving = false;
          this.showError('שגיאה בשמירה - נסה שוב');
        }
      });
  }
  
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'סגור', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
  
  private showError(message: string): void {
    this.snackBar.open(message, 'סגור', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }
}
```

### Template Structure

```html
<div class="detail-container" *ngIf="organization && !loading && !error">
  <!-- Greeting Card (from Story 2.2) -->
  <div class="greeting-card">
    <h1>שלום {{ organization.name }}</h1>
  </div>
  
  <!-- Prompt Editor Card (from Story 2.2) -->
  <div class="prompt-editor-card">
    <label>פרומפט</label>
    <textarea 
      [(ngModel)]="organization.prompt"
      class="prompt-textarea"
      placeholder="הזן את הפרומפט כאן...">
    </textarea>
  </div>
  
  <!-- AI Suggestion Card (NEW) -->
  <div class="suggestion-card" *ngIf="suggestion">
    <div class="suggestion-header">
      <mat-icon>lightbulb</mat-icon>
      <h3>הצעה משופרת</h3>
    </div>
    <div class="suggestion-content">
      {{ suggestion }}
    </div>
    <div class="suggestion-actions">
      <button mat-raised-button color="primary" (click)="acceptSuggestion()">
        <mat-icon>check</mat-icon>
        אשר
      </button>
      <button mat-stroked-button (click)="rejectSuggestion()">
        <mat-icon>close</mat-icon>
        דחה
      </button>
    </div>
  </div>
  
  <!-- Actions Section -->
  <div class="actions-section">
    <button 
      mat-raised-button 
      color="accent" 
      (click)="getSuggestion()"
      [disabled]="!organization.prompt || loadingSuggestion">
      <mat-spinner diameter="20" *ngIf="loadingSuggestion"></mat-spinner>
      <mat-icon *ngIf="!loadingSuggestion">auto_awesome</mat-icon>
      קבל הצעה
    </button>
    
    <button 
      mat-raised-button 
      color="primary" 
      (click)="save()"
      [disabled]="!isModified || saving">
      <mat-spinner diameter="20" *ngIf="saving"></mat-spinner>
      <mat-icon *ngIf="!saving">save</mat-icon>
      שמור
    </button>
    
    <button mat-stroked-button routerLink="/">
      <mat-icon>arrow_forward</mat-icon>
      חזור
    </button>
  </div>
</div>
```

### Styling for Suggestion Card

```css
.suggestion-card {
  background: linear-gradient(135deg, #FFF9C4 0%, #FFF59D 100%);
  border: 2px solid #FBC02D;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(251, 192, 45, 0.2);
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  color: #F57F17;
}

.suggestion-header mat-icon {
  font-size: 28px;
  width: 28px;
  height: 28px;
}

.suggestion-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  font-family: 'Heebo', Arial, sans-serif;
}

.suggestion-content {
  background: #FFFFFF;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 16px;
  line-height: 1.6;
  direction: rtl;
  text-align: right;
  white-space: pre-wrap;
  border: 1px solid #FDD835;
}

.suggestion-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.suggestion-actions button {
  min-width: 120px;
}
```

### Actions Section Styling

```css
.actions-section {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.actions-section button {
  min-width: 140px;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
}

.actions-section button mat-icon {
  margin-left: 8px;
}

.actions-section button mat-spinner {
  margin-left: 8px;
}

@media (max-width: 768px) {
  .actions-section {
    flex-direction: column;
  }
  
  .actions-section button {
    width: 100%;
  }
}
```

### MatSnackBar Configuration

Add to `org-detail.component.ts` imports:
```typescript
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
```

Add to component imports array:
```typescript
imports: [
  // ... existing imports
  MatSnackBarModule
]
```

Inject in constructor:
```typescript
constructor(
  private route: ActivatedRoute,
  private router: Router,
  private orgService: OrganizationService,
  private snackBar: MatSnackBar
) {}
```

### Error Snackbar Styling

Add to `styles.css`:
```css
.error-snackbar {
  background-color: #D32F2F !important;
  color: #FFFFFF !important;
}

.error-snackbar .mat-simple-snack-bar-content {
  font-family: 'Heebo', Arial, sans-serif;
}
```

## Definition of Done

- [ ] "קבל הצעה" button added to actions section
- [ ] Suggestion API service method implemented
- [ ] Suggestion card displays when API returns response
- [ ] Loading spinner shows during suggestion API call
- [ ] Accept button replaces prompt with suggestion
- [ ] Reject button hides suggestion card
- [ ] "שמור" button saves changes via existing service
- [ ] Loading state on save button during API call
- [ ] Success snackbar shows "נשמר בהצלחה" after save
- [ ] Error snackbar shows on save failure
- [ ] Modified state tracking enables/disables save button
- [ ] Multiple suggestions can be requested
- [ ] Error handling for suggestion API failures
- [ ] All buttons have proper Hebrew labels and RTL icons
- [ ] Responsive design on mobile and desktop
- [ ] No console errors or warnings

## Risk Assessment

### Implementation Risks

- **Primary Risk:** Suggestion API not implemented yet on backend
- **Mitigation:** Mock API response during frontend development; implement service method with proper error handling
- **Verification:** Test with mock data, then integrate when backend ready

- **Secondary Risk:** Suggestion could be very long and break UI
- **Mitigation:** Max-height with scroll on suggestion content; CSS overflow handling
- **Verification:** Test with long suggestion text (500+ characters)

- **Tertiary Risk:** User loses unsaved changes when navigating
- **Mitigation:** Document as optional enhancement; can add CanDeactivate guard in future
- **Verification:** Manual testing of navigation scenarios

### Rollback Plan

1. Remove suggestion-related code (card, buttons, service method)
2. Keep save functionality working
3. Fall back to simple save-only interface

### Safety Checks

- [ ] Existing service methods unchanged (only addition)
- [ ] Save functionality can work independently of suggestions
- [ ] No impact on organization list page
- [ ] Backend gracefully handles missing suggestion endpoint (error handling)

## Files to Modify

### Modified Files
- `src/app/pages/org-detail.component.ts` - Add suggestion and save logic
- `src/app/pages/org-detail.component.html` - Add suggestion card and action buttons
- `src/app/pages/org-detail.component.css` - Style suggestion card and actions
- `src/app/services/organization.service.ts` - Add `getSuggestion()` method
- `src/styles.css` - Add error snackbar styling

### No New Files
- All additions to existing files from Story 2.2

## Testing Strategy

1. **AI Suggestion Flow:**
   - Enter prompt text → click "קבל הצעה" → suggestion displays
   - Click "אשר" → prompt replaced with suggestion
   - Click "דחה" → suggestion hides, prompt unchanged
   - Request multiple suggestions → each replaces previous
   - Empty prompt → "קבל הצעה" button disabled
   - API error → error message displays

2. **Save Flow:**
   - Modify prompt → "שמור" enabled
   - Click save → API called, success snackbar
   - Save error → error snackbar with retry
   - No changes → "שמור" disabled
   - Accept suggestion → "שמור" enabled (modified state)

3. **Loading States:**
   - Suggestion loading → spinner on "קבל הצעה" button
   - Save loading → spinner on "שמור" button
   - Button disabled during operation

4. **Integration:**
   - Save persists to backend
   - Refresh page shows saved changes
   - Navigate away and back → changes persist

5. **Edge Cases:**
   - Very long suggestion → scrollable
   - Network failure → proper error handling
   - Multiple rapid clicks → debounced/prevented

## Backend Requirements

The backend team needs to implement:

**Endpoint:** `POST http://35.225.79.109:3000/api/suggestions`

**Request Body:**
```json
{
  "prompt": "string"
}
```

**Success Response (200):**
```json
{
  "suggestion": "AI-improved prompt text"
}
```

**Error Response (400/500):**
```json
{
  "error": "Error message"
}
```

**Notes for Backend:**
- Should accept Hebrew text in prompt field
- Response should also support Hebrew
- Rate limiting recommended (prevent API abuse)
- Timeout: 30 seconds max for AI processing

## Implementation Notes

### Development Sequence

1. Add service method with mock data for testing:
```typescript
getSuggestion(prompt: string): Observable<{ suggestion: string }> {
  // Mock for development
  return of({ suggestion: 'הצעה משופרת: ' + prompt + ' (עם שיפורים)' })
    .pipe(delay(1500)); // Simulate API delay
}
```

2. Implement UI and state management
3. Test with mock data
4. Switch to real API when backend ready

### Future Enhancements

- Multiple suggestion variants (show 3 options)
- Suggestion history/undo
- Copy suggestion to clipboard
- Keyboard shortcuts (Ctrl+Enter to accept)
- Unsaved changes guard with CanDeactivate
- Auto-save draft to localStorage

## Hebrew Text Labels

**Buttons:**
- קבל הצעה - Get Suggestion
- אשר - Accept
- דחה - Reject  
- שמור - Save
- חזור - Back

**Messages:**
- נשמר בהצלחה - Saved successfully
- שגיאה בשמירה - נסה שוב - Save error - Try again
- שגיאה בקבלת הצעה - Error getting suggestion
- הצעה משופרת - Improved suggestion

**Icons:**
- auto_awesome - For suggestion button (sparkle/AI icon)
- lightbulb - For suggestion header
- check - Accept
- close - Reject
- save - Save
- arrow_forward - Back (RTL, so forward means back)
