const DB_NAME = 'VMInventoryDB';
const STORE_NAME = 'inventory';
const DB_VERSION = 1;

interface VMData {
  id?: number;
  data: Array<any>;
  timestamp: string;
}

let db: IDBDatabase | null = null;

export async function initDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

export async function saveVMData(data: any[]): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Clear existing data
    store.clear();

    // Save new data
    const vmData: VMData = {
      id: 1,
      data,
      timestamp: new Date().toISOString(),
    };

    const request = store.add(vmData);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function getVMData(): Promise<any[] | null> {
  try {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result as VMData | undefined;
        resolve(result?.data || null);
      };
    });
  } catch (error) {
    console.error('[v0] Error reading from IndexedDB:', error);
    return null;
  }
}

export async function getVMDataTimestamp(): Promise<string | null> {
  try {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result as VMData | undefined;
        resolve(result?.timestamp || null);
      };
    });
  } catch (error) {
    console.error('[v0] Error reading timestamp from IndexedDB:', error);
    return null;
  }
}

export async function clearVMData(): Promise<void> {
  try {
    const database = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.error('[v0] Error clearing IndexedDB:', error);
  }
}
