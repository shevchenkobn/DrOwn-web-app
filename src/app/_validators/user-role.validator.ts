import { FormControl, FormGroup } from '@angular/forms';
import { userRoleFromObject } from '../_models/user.model';

export function userRoleValidator(obj: Record<string, boolean>) {
  return () => {
    return !!userRoleFromObject(obj) ? null : { userRole: true };
  };
}
