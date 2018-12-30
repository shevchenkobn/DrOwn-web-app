import { ActivatedRouteSnapshot } from '@angular/router';
import { getCommonErrorMessage, isClientHttpError, ServerErrorCode } from './_services/error-codes';

export function getFullPath(pathFromRoot: ActivatedRouteSnapshot[], startingSlash = true) {
  return (startingSlash ? '/' : '') + pathFromRoot.map(o => o.url[0]).join('/');
}

export interface IEnum {
  [prop: string]: number | string;
}

export function enumToObject(enumType: IEnum) {
  const values: {[prop: string]: number} = {};
  for (const key of Object.keys(enumType)) {
    if (!Number.isNaN(Number.parseInt(key, 10))) { // Filter for non-numeric values
      continue;
    }
    values[key.toLowerCase()] = enumType[key] as number;
  }
  return values;
}

export function newUserOnErrorMessage(err: any) {
  console.error(err);
  let msg: string;
  if (isClientHttpError(err)) {
    msg = getCommonErrorMessage(err);
    if (!msg) {
      const code = err.error.code as ServerErrorCode;
      switch (code) {
        case ServerErrorCode.USER_EMAIL_DUPLICATE:
          msg = 'users.errors.email-dup';
          break;

        case 'SCHEMA_VALIDATION_FAILED' as any:
          try {
            if (
              err.error.results.errors[0].code === 'INVALID_FORMAT'
              && err.error.results.errors[0].path.length === 1
              && err.error.results.errors[0].path[0] === 'email'
            ) {
              msg = 'user-errors.email';
              break;
            }
          } catch {}

        // tslint:disable-next-line:no-switch-case-fall-through
        default:
          msg = 'errors.unknown';
      }
    }
  } else {
    msg = 'errors.unknown';
  }
  return msg;
}
