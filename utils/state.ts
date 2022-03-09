import {ActionCreatorWithPayload, AnyAction} from '@reduxjs/toolkit';
import {Dispatch} from 'react';

/*
 * Utilities.
 */

export function makeDispatchAction<T>(dispatch: Dispatch<AnyAction>, action: ActionCreatorWithPayload<T>) {
  return (value: T) => dispatch(action(value));
}
