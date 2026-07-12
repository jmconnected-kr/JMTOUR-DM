'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createWorkspaceFromLegacy,
  defaultDemoWorkspace,
  getDefaultContentForEvent,
  normalizeDemoWorkspace,
  type DemoContent,
  type DemoEvent,
  type DemoWorkspace,
  type ParticipantAccount,
} from './demo-content-schema';

export type { DemoContent, DemoEvent, DemoWorkspace, ParticipantAccount } from './demo-content-schema';

const STORAGE_KEY = 'travel-demo-admin-draft-v3';

type DemoContentContextValue = {
  workspace: DemoWorkspace;
  setWorkspace: React.Dispatch<React.SetStateAction<DemoWorkspace>>;
  content: DemoContent;
  activeEvent: DemoEvent;
  updateActivePageSection: <K extends keyof DemoContent>(key: K, patch: Partial<DemoContent[K]>) => void;
  setActiveEventId: (eventId: string) => void;
  upsertEvent: (event: DemoEvent) => void;
  removeEvent: (eventId: string) => void;
  upsertAccount: (account: ParticipantAccount) => void;
  removeAccount: (accountId: string) => void;
  resetContent: () => void;
  reloadFromRemote: () => Promise<void>;
  saveToRemote: (role: 'admin' | 'participant') => Promise<{ ok: boolean; message: string }>;
  isLoading: boolean;
  isSaving: boolean;
  saveMessage: string;
  remoteLoaded: boolean;
  backendConfigured: boolean;
};

type LoadResponse = {
  workspace?: DemoWorkspace;
  content?: DemoContent;
  source?: 'supabase' | 'default';
  configured?: boolean;
  message?: string;
};

const DemoContentContext = createContext<DemoContentContextValue | null>(null);

function getActiveContent(workspace: DemoWorkspace) {
  return workspace.pagesByEvent[workspace.activeEventId] ?? getDefaultContentForEvent(workspace.activeEventId);
}

export function DemoContentProvider({ children }: { children: React.ReactNode }) {
  const [workspace, setWorkspace] = useState<DemoWorkspace>(defaultDemoWorkspace);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [remoteLoaded, setRemoteLoaded] = useState(false);
  const [backendConfigured, setBackendConfigured] = useState(false);

  const reloadFromRemote = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/demo-content', { cache: 'no-store' });
      if (!response.ok) throw new Error('load failed');
      const data = (await response.json()) as LoadResponse;
      const nextWorkspace = data.workspace
        ? normalizeDemoWorkspace(data.workspace)
        : createWorkspaceFromLegacy(data.content);
      setWorkspace(nextWorkspace);
      setRemoteLoaded(data.source === 'supabase');
      setBackendConfigured(Boolean(data.configured));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextWorkspace));
      setSaveMessage(data.message ?? '데이터를 불러왔습니다.');
    } catch {
      const localDraft = window.localStorage.getItem(STORAGE_KEY);
      setRemoteLoaded(false);
      setBackendConfigured(false);

      if (localDraft) {
        try {
          const parsed = normalizeDemoWorkspace(JSON.parse(localDraft) as DemoWorkspace);
          setWorkspace(parsed);
          setSaveMessage('원격 로드 실패로 로컬 임시본을 불러왔습니다.');
        } catch {
          setWorkspace(defaultDemoWorkspace);
          setSaveMessage('원격 로드에 실패해 기본값을 사용합니다.');
        }
      } else {
        setWorkspace(defaultDemoWorkspace);
        setSaveMessage('원격 로드에 실패해 기본값을 사용합니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    reloadFromRemote();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
    }
  }, [workspace, isLoading]);

  const saveToRemote = async (role: 'admin' | 'participant') => {
    setIsSaving(true);
    setSaveMessage(role === 'admin' ? 'Supabase에 저장 중입니다...' : '참여자 변경사항을 저장 중입니다...');

    try {
      const response = await fetch('/api/demo-content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workspace }),
      });

      const data = (await response.json()) as { message?: string; workspace?: DemoWorkspace };
      if (!response.ok) {
        const message = data.message ?? '저장에 실패했습니다.';
        setSaveMessage(message);
        return { ok: false, message };
      }

      if (data.workspace) {
        const normalized = normalizeDemoWorkspace(data.workspace);
        setWorkspace(normalized);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      } else {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
      }

      setRemoteLoaded(true);
      setBackendConfigured(true);
      const message = data.message ?? 'Supabase에 저장되었습니다.';
      setSaveMessage(message);
      return { ok: true, message };
    } catch {
      const message = '네트워크 오류로 저장하지 못했습니다.';
      setSaveMessage(message);
      return { ok: false, message };
    } finally {
      setIsSaving(false);
    }
  };

  const value = useMemo(() => {
    const normalizedWorkspace = normalizeDemoWorkspace(workspace);
    const activeEvent = normalizedWorkspace.events.find((event) => event.id === normalizedWorkspace.activeEventId) ?? normalizedWorkspace.events[0];
    const content = getActiveContent(normalizedWorkspace);

    const updateActivePageSection = <K extends keyof DemoContent>(key: K, patch: Partial<DemoContent[K]>) => {
      setWorkspace((prev) => {
        const base = normalizeDemoWorkspace(prev);
        const currentContent = getActiveContent(base);
        return {
          ...base,
          pagesByEvent: {
            ...base.pagesByEvent,
            [base.activeEventId]: {
              ...currentContent,
              [key]: {
                ...currentContent[key],
                ...patch,
              },
            },
          },
        };
      });
    };

    return {
      workspace: normalizedWorkspace,
      setWorkspace,
      content,
      activeEvent,
      updateActivePageSection,
      setActiveEventId: (eventId: string) =>
        setWorkspace((prev) => {
          const base = normalizeDemoWorkspace(prev);
          if (!base.events.some((event) => event.id === eventId)) return base;
          return { ...base, activeEventId: eventId };
        }),
      upsertEvent: (event: DemoEvent) =>
        setWorkspace((prev) => {
          const base = normalizeDemoWorkspace(prev);
          const exists = base.events.some((item) => item.id === event.id);
          const nextEvents = exists
            ? base.events.map((item) => (item.id === event.id ? event : item))
            : [...base.events, event];
          return normalizeDemoWorkspace({
            ...base,
            events: nextEvents,
            pagesByEvent: exists
              ? base.pagesByEvent
              : {
                  ...base.pagesByEvent,
                  [event.id]: getDefaultContentForEvent(event.id),
                },
          });
        }),
      removeEvent: (eventId: string) =>
        setWorkspace((prev) => {
          const base = normalizeDemoWorkspace(prev);
          if (base.events.length <= 1) return base;
          const nextEvents = base.events.filter((event) => event.id !== eventId);
          const nextPages = { ...base.pagesByEvent };
          delete nextPages[eventId];
          const nextAccounts = base.accounts.map((account) =>
            account.eventId === eventId ? { ...account, eventId: nextEvents[0].id } : account,
          );
          return normalizeDemoWorkspace({
            activeEventId: base.activeEventId === eventId ? nextEvents[0].id : base.activeEventId,
            events: nextEvents,
            accounts: nextAccounts,
            pagesByEvent: nextPages,
          });
        }),
      upsertAccount: (account: ParticipantAccount) =>
        setWorkspace((prev) => {
          const base = normalizeDemoWorkspace(prev);
          const exists = base.accounts.some((item) => item.id === account.id);
          return {
            ...base,
            accounts: exists
              ? base.accounts.map((item) => (item.id === account.id ? account : item))
              : [...base.accounts, account],
          };
        }),
      removeAccount: (accountId: string) =>
        setWorkspace((prev) => {
          const base = normalizeDemoWorkspace(prev);
          return {
            ...base,
            accounts: base.accounts.filter((account) => account.id !== accountId),
          };
        }),
      resetContent: () => setWorkspace(defaultDemoWorkspace),
      reloadFromRemote,
      saveToRemote,
      isLoading,
      isSaving,
      saveMessage,
      remoteLoaded,
      backendConfigured,
    };
  }, [workspace, isLoading, isSaving, saveMessage, remoteLoaded, backendConfigured]);

  return <DemoContentContext.Provider value={value}>{children}</DemoContentContext.Provider>;
}

export function useDemoContent() {
  const value = useContext(DemoContentContext);
  if (!value) throw new Error('useDemoContent must be used within DemoContentProvider');
  return value;
}
