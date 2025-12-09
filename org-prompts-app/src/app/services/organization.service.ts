import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';

export interface Organization {
  _id?: string;
  id?: string;
  name: string;
  prompt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  // Update this to your backend base URL (e.g., http://localhost:3000 or https://api.example.com)
  private readonly baseUrl = 'http://35.225.79.109:3000';
  private readonly resource = 'api/agents'; // endpoint path

  private organizations$ = new BehaviorSubject<Organization[]>([]);
  private isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadOrganizations();
  }

  getOrganizations(): Observable<Organization[]> {
    return this.organizations$.asObservable();
  }

  isLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  private url(path: string = ''): string {
    const trimmed = path.replace(/^\//, '');
    return `${this.baseUrl}/${this.resource}${trimmed ? '/' + trimmed : ''}`;
  }

  async loadOrganizations(): Promise<void> {
    try {
      this.isLoading$.next(true);
      const response = await firstValueFrom(
        this.http.get<ApiResponse<Organization[]>>(this.url())
      );
      this.organizations$.next(response.data ?? []);
    } catch (error) {
      console.error('Failed to load organizations from API:', error);
      this.organizations$.next([]);
    } finally {
      this.isLoading$.next(false);
    }
  }

  async addOrganization(org: Organization): Promise<void> {
    try {
      this.isLoading$.next(true);
      const response = await firstValueFrom(
        this.http.post<ApiResponse<Organization>>(this.url(), org)
      );
      if (response.data) {
        this.organizations$.next([...this.organizations$.value, response.data]);
      }
    } catch (error) {
      console.error('Error adding organization (API):', error);
      throw error;
    } finally {
      this.isLoading$.next(false);
    }
  }

  async updateOrganization(id: string, org: Organization): Promise<void> {
    try {
      this.isLoading$.next(true);
      const response = await firstValueFrom(
        this.http.put<ApiResponse<Organization>>(this.url(id), org)
      );
      if (response.data) {
        const current = this.organizations$.value;
        const index = current.findIndex(o => o._id === id || o.id === org.id);
        if (index !== -1) {
          current[index] = { ...response.data };
          this.organizations$.next([...current]);
        }
      }
    } catch (error) {
      console.error('Error updating organization (API):', error);
      throw error;
    } finally {
      this.isLoading$.next(false);
    }
  }

  async removeOrganization(id: string): Promise<void> {
    try {
      this.isLoading$.next(true);
      await firstValueFrom(
        this.http.delete<ApiResponse<any>>(this.url(id))
      );
      const current = this.organizations$.value;
      this.organizations$.next(current.filter(o => o._id !== id && o.id !== id));
    } catch (error) {
      console.error('Error deleting organization (API):', error);
      throw error;
    } finally {
      this.isLoading$.next(false);
    }
  }

  getSuggestion(prompt: string): Observable<{ suggestion: string }> {
    // Mock implementation for now - backend endpoint not ready yet
    // return this.http.post<{ suggestion: string }>(`${this.baseUrl}/api/suggestions`, { prompt });
    
    // Mock data for testing
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ 
          suggestion: `הצעה משופרת עבור: "${prompt}"

שיפורים מוצעים:
• הוספת הקשר ברור יותר
• שיפור המבנה והארגון
• דיוק גבוה יותר בניסוח

הפרומפט המשופר מאפשר תוצאות טובות ומדויקות יותר.`
        });
        observer.complete();
      }, 1500);
    });
  }
}