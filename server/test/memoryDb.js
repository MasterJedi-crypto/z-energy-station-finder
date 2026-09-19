import { ObjectId } from "mongodb";

function matches(doc, query = {}) {
  return Object.entries(query).every(([key, value]) => {
    if (value instanceof ObjectId || doc[key] instanceof ObjectId) {
      return String(doc[key]) === String(value);
    }
    return doc[key] === value;
  });
}

export function createMemoryDb() {
  const collections = {
    "user-credentials": [],
    "business-profiles": [],
    "saved-trips": [],
  };

  return {
    collection(name) {
      const store = (collections[name] ??= []);
      return {
        async findOne(query) {
          return store.find((doc) => matches(doc, query)) ?? null;
        },
        async insertOne(doc) {
          const _id = doc._id ?? new ObjectId();
          store.push({ ...doc, _id });
          return { insertedId: _id };
        },
        async updateOne(query, update) {
          const doc = store.find((item) => matches(item, query));
          if (!doc) return { matchedCount: 0 };
          Object.assign(doc, update.$set ?? {});
          return { matchedCount: 1 };
        },
        async createIndex() {
          return "ok";
        },
        async deleteOne(query) {
          const index = store.findIndex((item) => matches(item, query));
          if (index < 0) return { deletedCount: 0 };
          store.splice(index, 1);
          return { deletedCount: 1 };
        },
        find(query) {
          let rows = store.filter((doc) => matches(doc, query));
          return {
            sort(spec) {
              const [key, dir] = Object.entries(spec)[0] ?? ["createdAt", -1];
              rows = [...rows].sort((a, b) => {
                if (a[key] === b[key]) return 0;
                return a[key] > b[key] ? dir : -dir;
              });
              return {
                limit(n) {
                  rows = rows.slice(0, n);
                  return {
                    async toArray() {
                      return rows;
                    },
                  };
                },
              };
            },
          };
        },
      };
    },
  };
}
