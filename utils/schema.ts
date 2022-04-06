import {ZodError, ZodIssue, ZodObject, ZodString, extendShape, z} from 'zod';

/*
 * Utilities.
 */

export function validateSchema<T>(
  schema: ZodObject<extendShape<T, unknown>> | ZodString,
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

export function validateEmail(email: string): string | undefined {
  const errors = validateSchema(z.string().email(), email);

  return errors && errors.length > 0 ? errors[0].message : undefined;
}
