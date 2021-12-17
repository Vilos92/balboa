import {ZodError, ZodIssue, ZodObject, extendShape} from 'zod';

/*
 * Utilities.
 */

export function validateSchema<T>(
  schema: ZodObject<extendShape<T, {}>>,
  blob: unknown
): readonly ZodIssue[] | undefined {
  try {
    schema.parse(blob);
  } catch (error) {
    if (error instanceof ZodError) {
      return error.errors;
    }

    throw error;
  }
}

export function computeFieldsSelect(fields: readonly string[]): Record<string, boolean> {
  return fields.reduce<Record<string, boolean>>((select, field) => ((select[field] = true), select), {});
}
