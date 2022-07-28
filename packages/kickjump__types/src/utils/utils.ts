import type { EnumUnion } from '../db.js';
import { Visibility } from '../db.js';

/**
 * Any action a member can take, can be taken by the manager, admin and owner.
 * This sets the order.
 */

export const VisibilityHierarchy = [
  Visibility.$public,
  Visibility.member,
  Visibility.editor,
  Visibility.manager,
  Visibility.admin,
  Visibility.owner,
] as const;

/**
 * Get the minimum visibility required for an action.
 */
export function minimumVisibility(minimum: Visibility) {
  return (visibility: EnumUnion<Visibility>) => {
    if (
      VisibilityHierarchy.indexOf(minimum) >= VisibilityHierarchy.indexOf(visibility as Visibility)
    ) {
      return [minimum];
    }

    return [visibility];
  };
}

/**
 * Removes all undefined values from an object. Neither Firestore nor the RealtimeDB allow `undefined` as a value.
 *
 * @param data The object to clean
 */
export function removeUndefined<Shape extends object>(data: Shape): Shape {
  const transformed = Object.create({});

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) {
      continue;
    }

    transformed[key] = value;
  }

  return transformed;
}
