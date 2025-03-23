import { Observable } from 'rxjs';

export abstract class AuthService {
  public abstract login(email: string, password: string): Observable<void>;

  public abstract logout(): void;

  public abstract get token(): string | null;
}
