import {
  DEFAULT_FORM_PARAMS,
  DoaFormParams,
  NaskahDoa,
  SavedDoaRecord,
  buildContextualDoaFallback,
  CONTOH_HARAPAN_MAP,
} from './doaLogic';

const DRAFT_STORAGE_KEY = 'doa_munajat_pro_active_draft_v1';
const HISTORY_STORAGE_KEY = 'doa_munajat_pro_saved_history_v1';
const IDB_NAME = 'DoaMunajatProDB';
const IDB_VERSION = 1;
const IDB_STORE_HISTORY = 'riwayat_doa';
const IDB_STORE_DRAFT = 'draf_aktif';

export interface ActiveDraftState {
  params: DoaFormParams;
  naskah: NaskahDoa;
  updatedAt: string;
}

function openDatabase(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const req = window.indexedDB.open(IDB_NAME, IDB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE_HISTORY)) {
          db.createObjectStore(IDB_STORE_HISTORY, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(IDB_STORE_DRAFT)) {
          db.createObjectStore(IDB_STORE_DRAFT);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export function getInitialSeedHistory(): SavedDoaRecord[] {
  const params1: DoaFormParams = {
    ...DEFAULT_FORM_PARAMS,
    jenisAcara: 'Pengajian / Majelis Taklim',
    harapanKhusus: CONTOH_HARAPAN_MAP['Pengajian / Majelis Taklim'],
  };
  const params2: DoaFormParams = {
    jenisAcara: 'Pelantikan Jabatan / Pengurus',
    acaraLainnya: '',
    bahasa: 'Arab + Indonesia',
    durasi: '3 Menit',
    harapanKhusus: CONTOH_HARAPAN_MAP['Pelantikan Jabatan / Pengurus'],
  };

  return [
    {
      id: 'seed-majelis-taklim',
      createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
      params: params1,
      naskah: buildContextualDoaFallback(params1),
    },
    {
      id: 'seed-pelantikan-pengurus',
      createdAt: new Date(Date.now() - 3600 * 1000 * 36).toISOString(),
      params: params2,
      naskah: buildContextualDoaFallback(params2),
    },
  ];
}

export function loadActiveDraft(): ActiveDraftState {
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ActiveDraftState;
      if (
        parsed &&
        parsed.params &&
        parsed.naskah &&
        Array.isArray(parsed.naskah.bagian_doa)
      ) {
        return parsed;
      }
    }
  } catch {
    // fallback to default
  }

  return {
    params: DEFAULT_FORM_PARAMS,
    naskah: buildContextualDoaFallback(DEFAULT_FORM_PARAMS),
    updatedAt: new Date().toISOString(),
  };
}

export async function saveActiveDraft(
  params: DoaFormParams,
  naskah: NaskahDoa
): Promise<ActiveDraftState> {
  const state: ActiveDraftState = {
    params,
    naskah,
    updatedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage quota errors
  }

  const db = await openDatabase();
  if (db) {
    try {
      const tx = db.transaction(IDB_STORE_DRAFT, 'readwrite');
      tx.objectStore(IDB_STORE_DRAFT).put(state, 'current');
    } catch {
      // ignore
    }
  }

  return state;
}

export function loadSavedHistory(): SavedDoaRecord[] {
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SavedDoaRecord[];
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  const seeds = getInitialSeedHistory();
  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(seeds));
  } catch {
    // ignore
  }
  return seeds;
}

export async function saveToHistory(
  params: DoaFormParams,
  naskah: NaskahDoa
): Promise<SavedDoaRecord[]> {
  const current = loadSavedHistory();
  const newRecord: SavedDoaRecord = {
    id: `doa-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    params: { ...params },
    naskah: JSON.parse(JSON.stringify(naskah)),
  };

  const updated = [newRecord, ...current].slice(0, 50);

  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  const db = await openDatabase();
  if (db) {
    try {
      const tx = db.transaction(IDB_STORE_HISTORY, 'readwrite');
      tx.objectStore(IDB_STORE_HISTORY).put(newRecord);
    } catch {
      // ignore
    }
  }

  return updated;
}

export async function deleteFromHistory(id: string): Promise<SavedDoaRecord[]> {
  const current = loadSavedHistory();
  const updated = current.filter((item) => item.id !== id);

  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  const db = await openDatabase();
  if (db) {
    try {
      const tx = db.transaction(IDB_STORE_HISTORY, 'readwrite');
      tx.objectStore(IDB_STORE_HISTORY).delete(id);
    } catch {
      // ignore
    }
  }

  return updated;
}
