/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {assertDefined} from '../../util/assert';
import {global} from '../../util/global';
import {RElement} from '../interfaces/renderer';
import {CONTEXT, LView, RootContext} from '../interfaces/view';
import {getRootView} from './view_traversal_utils';

/**
 * Returns whether the values are different from a change detection stand point.
 *
 * Constraints are relaxed in checkNoChanges mode. See `devModeEqual` for details.
 */
export function isDifferent(a: any, b: any): boolean {
  // NaN is the only value that is not equal to itself so the first
  // test checks if both a and b are not NaN
  return !(a !== a && b !== b) && a !== b;
}

/**
 * Used for stringify render output in Ivy.
 */
export function renderStringify(value: any): string {
  if (typeof value == 'function') return value.name || value;
  if (typeof value == 'string') return value;
  if (value == null) return '';
  if (typeof value == 'object' && typeof value.type == 'function')
    return value.type.name || value.type;
  return '' + value;
}


export const defaultScheduler =
    (typeof requestAnimationFrame !== 'undefined' && requestAnimationFrame ||  // browser only
     setTimeout                                                                // everything else
     ).bind(global);

/**
 *
 * @codeGenApi
 */
export function ΔresolveWindow(element: RElement & {ownerDocument: Document}) {
  return {name: 'window', target: element.ownerDocument.defaultView};
}

/**
 *
 * @codeGenApi
 */
export function ΔresolveDocument(element: RElement & {ownerDocument: Document}) {
  return {name: 'document', target: element.ownerDocument};
}

/**
 *
 * @codeGenApi
 */
export function ΔresolveBody(element: RElement & {ownerDocument: Document}) {
  return {name: 'body', target: element.ownerDocument.body};
}

/**
 * The special delimiter we use to separate property names, prefixes, and suffixes
 * in property binding metadata. See storeBindingMetadata().
 *
 * We intentionally use the Unicode "REPLACEMENT CHARACTER" (U+FFFD) as a delimiter
 * because it is a very uncommon character that is unlikely to be part of a user's
 * property names or interpolation strings. If it is in fact used in a property
 * binding, DebugElement.properties will not return the correct value for that
 * binding. However, there should be no runtime effect for real applications.
 *
 * This character is typically rendered as a question mark inside of a diamond.
 * See https://en.wikipedia.org/wiki/Specials_(Unicode_block)
 *
 */
export const INTERPOLATION_DELIMITER = `�`;

/**
 * Determines whether or not the given string is a property metadata string.
 * See storeBindingMetadata().
 */
export function isPropMetadataString(str: string): boolean {
  return str.indexOf(INTERPOLATION_DELIMITER) >= 0;
}

/**
 * Unwrap a value which might be behind a closure (for forward declaration reasons).
 */
export function maybeUnwrapFn<T>(value: T | (() => T)): T {
  if (value instanceof Function) {
    return value();
  } else {
    return value;
  }
}
