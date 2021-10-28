const objectHash = require('./hash.js')

interface IMap<K, V> {
  byKey: INormalize<V>;
  arrayOfKeys: Array<K>;

  readonly size: number;

  set(key: K, value: V): IMap<K, V>;
  get(key: K): V;
  has(key: K): boolean;
  delete(key: K): void;
  clear(): void;

  entries(): MapEntries<K, V>;
  keys(): Array<K>;
  values(): Array<V>;

  forEach(func: Function): void;

  [Symbol.iterator](): IterableIterator<V>;
}

interface INormalize<T> {
  [key: string]: T;
  [key: number]: T;
}

type MapEntries<K, V> = Array<[K, V]>;

class MyMap<K, V> implements IMap<K, V> {
  byKey: INormalize<V>;
  arrayOfKeys: Array<K>;

  constructor() {
    this.byKey = {};
    this.arrayOfKeys = [];
  }

  set(key: K, value: V): IMap<K, V> {
    if (!this.get(key)) {
      this.arrayOfKeys.push(key);
    }

    this.byKey[this.hash(key)] = value;

    return this;
  }

  get(key: K): V {
    return this.byKey[this.hash(key)];
  }

  has(key: K): boolean {
    return !!this.get(key);
  }

  // TODO попробовать оптимизировать
  delete(key: K): void {
    delete this.byKey[this.hash(key)];
    this.arrayOfKeys = this.arrayOfKeys.filter(item => item !== key);
  }

  clear(): void {
    this.byKey = {};
    this.arrayOfKeys = [];
  }

  keys(): Array<K> {
    return this.arrayOfKeys;
  }

  values(): Array<V> {
    return this.arrayOfKeys.map(key => this.get(key));
  }

  entries(): MapEntries<K, V> {
    return this.arrayOfKeys.map(key => {
      const value: V = this.get(key);
      return [key, value];
    });
  };

  forEach(func: Function): void {
    this.arrayOfKeys.forEach(key => {
      func(this.get(key), key, this);
    })
  }

  get size(): number {
    return this.arrayOfKeys.length;
  }

  private hash(key: K): string {
    return objectHash(key);
  }

  // TODO разобраться, как это работает
  *[Symbol.iterator]() {
    for (const key of this.arrayOfKeys) {
      yield this.get(key);
    }
  };
}

// const map: IMap<string, number> = new MyMap();
// map.set('123', 1);
// map.set('3213', 2);
// map.set('1243242343', 3);

// for (const value of map) {
//   console.log(value);
// }
