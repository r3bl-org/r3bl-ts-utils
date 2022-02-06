/*
 Copyright 2022 R3BL LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

// Base data class.

export class Data {
  toString = (): string => {
    const thisAsString = anyToString(this);
    try {
      const object: unknown = JSON.parse(thisAsString);
      return JSON.stringify(object, null, 2);
    } catch (e) {
      return thisAsString;
    }
  };
}

export function anyToString(arg: any) {
  if (!arg || typeof arg === "function")
    return "";
  if (typeof arg === "string")
    return `"${arg}"`;

  const strings = new Array<string>();

  if (arg instanceof Map)
    strings.push(mapToString(arg));
  else if (Array.isArray(arg))
    strings.push(arrayToString(arg));
  else if (typeof arg === "object")
    strings.push(objectToString(arg as Record<string, unknown>));

  return strings.join(", ");
}
function mapToString(map: Map<any, any>): string {
  const strings = new Array<string>();
  for (const [ key, value ] of map.entries())
    strings.push(`${anyToString(key)}:${anyToString(value)}`);
  return `{ ${strings.join(", ")} }`;
}
function arrayToString(array: Array<any>): string {
  const strings = new Array<string>();
  array.forEach((value) => strings.push(`${anyToString(value)}`));
  return `[ ${strings.join(", ")} ]`;
}
function objectToString(object: Record<string, unknown>): string {
  const strings = new Array<string>();
  for (const [ key, value ] of Object.entries(object)) {
    if (!value || typeof value === "function")
      continue; // Skip functions & falsy values.
    strings.push(`${anyToString(key)}:${anyToString(value)}`);
  }
  return `{ ${strings.join(", ")} }`;
}
