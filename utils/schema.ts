import {ZodError, ZodIssue, ZodObject, extendShape} from 'zod';

/*
 * Utilities.
 */

export function validateSchema<T>(
  object: ZodObject<extendShape<T, {}>>,
  blob: unknown
): readonly ZodIssue[] | undefined {
  try {
    object.parse(blob);
    return undefined;
  } catch (error) {
    if (error instanceof ZodError) {
      return error.errors;
    }

    throw error;
  }
}
