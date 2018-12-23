export function noInstance(v: any) {
  return v === undefined || v === null;
}

export function cloneArray<T extends string | number>(arr: T[]): T[] {
  if (arr) {
    return arr.slice(0);
  }
}

/**
 * Converts an object to a Map.
 * The names of the properties of the object are used as the map's keys.
 * All the property values of the object must be of the same type.
 * @param o Object to convert to Map.
 */
export function toMap<V>(o: { [key: string]: V }): Map<string, V> {
  if (o) {
    const keys = Object.getOwnPropertyNames(o);
    const map = new Map();

    for (const key of keys) {
      map[key] = o[key];
    }

    return map;
  }
}
