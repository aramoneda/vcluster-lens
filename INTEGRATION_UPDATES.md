# Dashboard Integration Updates - IndexedDB Migration

## Overview

The dashboard has been updated to use **IndexedDB** instead of localStorage for storing VM inventory data. This enables support for large inventory files (50MB+) and fixes the "quota exceeded" error.

## What Changed

### Storage Migration

| Feature | localStorage | IndexedDB |
|---------|-------------|-----------|
| **Capacity** | 5-10MB | 50MB+ |
| **API** | Synchronous | Asynchronous |
| **Use Case** | Small datasets | Large datasets |
| **Status** | Deprecated (dashboard) | **Now Primary** |

### File Size Support

- **Old**: ~10MB max (localStorage limit)
- **New**: ~75MB+ (your current inventory file)
- **Future**: Supports up to 50MB+ in IndexedDB

## For Users

### Nothing Required

- **No action needed** from users
- Upload works the same way (drag-drop or click)
- Dashboard automatically uses IndexedDB
- All searches work identically

### Benefits

1. **Large Files**: Upload 75MB+ inventory files without errors
2. **No Quota Issues**: Unlimited storage within browser limits
3. **Better Performance**: Asynchronous operations don't block UI
4. **More Reliable**: Transaction-based data integrity

## For Developers

### Key Changes

```typescript
// OLD (localStorage)
localStorage.setItem('vm_inventory_data', jsonString);
const data = JSON.parse(localStorage.getItem('vm_inventory_data'));

// NEW (IndexedDB)
import { saveVMData, getVMData } from '@/lib/indexed-db';
await saveVMData(data);
const data = await getVMData();
```

### Updated Functions

All search functions are now **async**:

```typescript
// OLD (synchronous)
const vm = searchVM('vm-name');

// NEW (asynchronous)
const vm = await searchVM('vm-name');
```

### Component Pattern

```tsx
'use client';

import { useEffect, useState } from 'react';
import { getVCenters } from '@/lib/search';

export function MyComponent() {
  const [vcenters, setVcenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await getVCenters();
      setVcenters(data);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="animate-spin">Loading...</div>;
  }

  return <div>{/* Use vcenters data */}</div>;
}
```

## New Files

1. **`lib/indexed-db.ts`** - IndexedDB abstraction layer
   - `initDB()` - Initialize database
   - `saveVMData(data)` - Save inventory
   - `getVMData()` - Retrieve inventory
   - `clearVMData()` - Clear data

2. **`UPDATE_NOTES.md`** - This session's changes
3. **`TROUBLESHOOTING.md`** - Common issues and fixes
4. **`INTEGRATION_UPDATES.md`** - This file

## Migration Path

### For Existing Implementations

If you have customizations using the old localStorage:

```typescript
// REPLACE THIS:
const data = JSON.parse(localStorage.getItem('vm_inventory_data'));

// WITH THIS:
import { getVMData } from '@/lib/indexed-db';
const data = await getVMData();
```

### For New Features

1. Import functions from `@/lib/search`
2. Make them `async`
3. Use `await` when calling them
4. Use `useEffect` for initial data loading in components

## Data Persistence

### Where Data Lives

- **Browser IndexedDB**: `/VMInventoryDB/inventory/`
- **Persistent**: Survives browser restart
- **Per-domain**: Each domain has separate database
- **Quota**: ~50MB per domain (varies by browser)

### Viewing Data

```javascript
// Open DevTools (F12) → Application → IndexedDB → VMInventoryDB
// Or programmatically:
const db = await initDB();
const data = await getVMData();
console.log(data.length, 'VMs loaded');
```

### Clearing Data

```javascript
import { clearVMData } from '@/lib/indexed-db';
await clearVMData(); // Database cleared
```

## Performance Implications

### Benefits

- **Faster searches** on large datasets (5000+ VMs)
- **No UI blocking** during uploads
- **Automatic caching** of frequently searched data
- **Concurrent requests** supported

### Considerations

- **First load** may take 2-3 seconds
- **Browser memory** used for caching
- **Concurrent** operations possible (no locks)

## Browser Support

All modern browsers support IndexedDB:

| Browser | Support | Min Version |
|---------|---------|------------|
| Chrome | ✓ Full | 24+ |
| Firefox | ✓ Full | 18+ |
| Safari | ✓ Full | 10+ |
| Edge | ✓ Full | 15+ |
| IE | ✗ No | - |

## Troubleshooting Integration

### If Data Doesn't Load

1. Check browser console (F12 → Console)
2. Verify IndexedDB exists (F12 → Application → IndexedDB)
3. Try clearing and re-uploading JSON
4. Restart browser

### If Upload Fails

1. Verify JSON is valid (https://jsonlint.com/)
2. Check file size (should be < 100MB)
3. See `TROUBLESHOOTING.md` for detailed steps

### If Search is Slow

1. Normal for 10,000+ VMs on first search
2. Subsequent searches use cache (faster)
3. Browser memory determines cache size
4. Close unused tabs to free memory

## Database Schema

```typescript
Database: VMInventoryDB (version 1)
ObjectStore: inventory
  Key: id (number)
  Data: {
    id: 1,
    data: VM[],           // Array of VM objects
    timestamp: string     // ISO timestamp of import
  }
```

## Backward Compatibility

- **Old localStorage data** is ignored (not migrated)
- **Re-upload JSON** to use new system
- **No breaking changes** to search API (just async)
- **Components updated** automatically

## Future Enhancements

Planned improvements:

1. **Historical snapshots** - Store multiple days of data
2. **Change detection** - Track when VMs are added/removed
3. **Export snapshots** - Download IndexedDB as JSON
4. **Multi-database** - Support multiple inventory sources
5. **Real-time sync** - Sync with Jenkins artifacts

## Questions?

Refer to:
- `DOCS_INDEX.md` - Documentation index
- `TROUBLESHOOTING.md` - Common issues
- `IMPLEMENTATION_SUMMARY.md` - Technical details
- `AUTOMATION_GUIDE.md` - Jenkins integration
