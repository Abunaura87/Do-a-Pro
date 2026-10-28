import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DoaFormCard } from './components/DoaFormCard';
import { DoaScriptCard } from './components/DoaScriptCard';
import { HistorySection } from './components/HistorySection';
import { PodiumModal } from './components/PodiumModal';
import {
  DoaFormParams,
  NaskahDoa,
  SavedDoaRecord,
  getContohHarapan,
  validateFormParams,
  normalizeNaskahDoa,
  buildContextualDoaFallback,
} from './utils/doaLogic';
import {
  loadActiveDraft,
  saveActiveDraft,
  loadSavedHistory,
  saveToHistory,
  deleteFromHistory,
} from './utils/localDb';

export default function App() {
  const initialDraft = loadActiveDraft();

  const [params, setParams] = useState<DoaFormParams>(initialDraft.params);
  const [naskah, setNaskah] = useState<NaskahDoa>(initialDraft.naskah);
  const [lastAutoSaved, setLastAutoSaved] = useState<string>(() =>
    new Date(initialDraft.updatedAt).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    })
  );
  const [historyRecords, setHistoryRecords] = useState<SavedDoaRecord[]>(() =>
    loadSavedHistory()
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamingStatus, setStreamingStatus] = useState<string>('');
  const [streamingSnippet, setStreamingSnippet] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPodiumOpen, setIsPodiumOpen] = useState<boolean>(false);

  // Auto-save active draft to localStorage & IndexedDB on every change
  useEffect(() => {
    let active = true;
    saveActiveDraft(params, naskah).then((savedState) => {
      if (active) {
        setLastAutoSaved(
          new Date(savedState.updatedAt).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          })
        );
      }
    });
    return () => {
      active = false;
    };
  }, [params, naskah]);

  const handleChangeParams = (next: DoaFormParams) => {
    setErrorMessage(null);
    setParams(next);
  };

  const handleFillContohHarapan = () => {
    setErrorMessage(null);
    const contoh = getContohHarapan(params.jenisAcara, params.acaraLainnya);
    setParams((prev) => ({
      ...prev,
      harapanKhusus: contoh,
    }));
  };

  const handleGenerateDoa = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const validation = validateFormParams(params);
    if (!validation.valid) {
      setErrorMessage(validation.errorMessage || 'Parameter belum lengkap.');
      return;
    }

    setIsLoading(true);
    setIsStreaming(true);
    setStreamingSnippet('');
    setStreamingStatus('Memulai penyusunan riil time...');

    try {
      const response = await fetch('/api/doa/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok || !response.body) {
        throw new Error('Gagal membuka siaran riil time');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let receivedFinal = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr) continue;

          try {
            const eventData = JSON.parse(jsonStr);

            if (eventData.type === 'start') {
              setStreamingStatus(eventData.message || 'Menyiapkan susunan doa...');
            } else if (eventData.type === 'progress') {
              setStreamingStatus(
                eventData.message ||
                  `Menyusun 0${(eventData.sectionIndex || 0) + 1}. ${eventData.sectionName}`
              );
            } else if (eventData.type === 'chunk') {
              const textChunk = eventData.text || '';
              setStreamingSnippet((prev) => {
                const combined = prev + textChunk;
                return combined.length > 400 ? combined.slice(-400) : combined;
              });
            } else if (eventData.type === 'done' && eventData.naskah) {
              const normalized = normalizeNaskahDoa(eventData.naskah, params);
              setNaskah(normalized);
              receivedFinal = true;
            } else if (eventData.type === 'error') {
              throw new Error(eventData.error || 'Terjadi kesalahan streaming.');
            }
          } catch {
            // continue parsing next line
          }
        }
      }

      if (!receivedFinal) {
        const fallback = buildContextualDoaFallback(params);
        setNaskah(fallback);
      }
    } catch {
      // Graceful fallback to guarantee zero disruption
      const fallback = buildContextualDoaFallback(params);
      setNaskah(fallback);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setStreamingStatus('');
      setStreamingSnippet('');
    }
  };

  const handleSaveToHistory = async () => {
    const updated = await saveToHistory(params, naskah);
    setHistoryRecords(updated);
  };

  const handleLoadRecord = (record: SavedDoaRecord) => {
    setErrorMessage(null);
    setParams({ ...record.params });
    setNaskah(JSON.parse(JSON.stringify(record.naskah)));
    const el = document.getElementById('lembar-naskah');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDeleteRecord = async (id: string) => {
    const updated = await deleteFromHistory(id);
    setHistoryRecords(updated);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        savedCount={historyRecords.length}
        onOpenPodium={() => setIsPodiumOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Primary 2-Column Workspace: Kartu 1 (Parameter) & Kartu 2 (Lembar Naskah) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <DoaFormCard
              params={params}
              isLoading={isLoading}
              errorMessage={errorMessage}
              lastAutoSavedTime={lastAutoSaved}
              onChangeParams={handleChangeParams}
              onFillContohHarapan={handleFillContohHarapan}
              onSubmit={handleGenerateDoa}
            />
          </div>

          <div className="lg:col-span-7">
            <DoaScriptCard
              naskah={naskah}
              bahasa={params.bahasa}
              durasi={params.durasi}
              isLoading={isLoading}
              isStreaming={isStreaming}
              streamingStatus={streamingStatus}
              streamingSnippet={streamingSnippet}
              onSaveToHistory={handleSaveToHistory}
              onOpenPodium={() => setIsPodiumOpen(true)}
              onUpdateNaskah={(updated) => setNaskah(updated)}
            />
          </div>
        </div>

        {/* Standar Amanah Ilmiah & Riwayat Database Lokal */}
        <HistorySection
          records={historyRecords}
          onLoadRecord={handleLoadRecord}
          onDeleteRecord={handleDeleteRecord}
        />
      </main>

      <footer className="border-t border-[#d4af37]/30 bg-[#06281e] text-[#eef5f2]/80 py-6 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="font-semibold text-[#fef9c3]">
            Do&apos;a &amp; Munajat PRO — Asisten Penyusun Naskah Doa Acara &amp; Munajat Khidmat
          </p>
          <p>
            Berpedoman pada Amanah Ilmiah: Membedakan Doa Ma&apos;tsur (Al-Qur&apos;an / Hadis) &amp; Munajat Kontekstual
          </p>
        </div>
      </footer>

      <PodiumModal
        isOpen={isPodiumOpen}
        naskah={naskah}
        bahasa={params.bahasa}
        onClose={() => setIsPodiumOpen(false)}
      />
    </div>
  );
}
