import { inject, Injectable } from '@angular/core';
import { UserService } from '../api/services';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeleteAccountService {
  private apiUserSvc = inject(UserService);

  deleteAccount(): Observable<void> {
    return this.apiUserSvc.deleteAccountUserDelete({}).pipe(
      map((resp) => {
        if (resp === 'ERROR') {
          throw new Error('Error deleting account');
        }
      }),
    );
  }
}
