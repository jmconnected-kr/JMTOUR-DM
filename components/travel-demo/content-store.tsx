'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultDemoContent, type DemoContent } from './demo-content-schema';

export type { DemoContent } from './demo-content-schema';

const STORAGE_KEY = 'travel-demo-admin-draft-v2';

type DemoContentContextValue = {
  content: DemoContent;
  setContent: React.Dispatch<React.SetStateAction<DemoContent>>;
  resetContent: () => void;
  reloadFromRemote: () => Promise<void>;
  saveToRemote: (adminKey: string) => Promise<{ ok: boolean; message: string }>;
  isLoading: boolean;
  isSaving: boolean;
  saveMessage: string;
  remoteLoaded: boolean;
  backendConfigured: boolean;
};

type LoadResponse = {
  content: DemoContent;
  source?: 'supabase' | 'default';
  configured?: boolean;
  message?: string;
};

const DemoContentContext = createContext<DemoContentContextValue | null>(null);

export function DemoContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<DemoContent>(defaultDemoContent);
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
      setContent(data.content);
      setRemoteLoaded(data.source === 'supabase');
      setBackendConfigured(Boolean(data.configured));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data.content));
      setSaveMessage(data.message ?? '데이터를 불러왔습니다.');
    } catch {
      const localDraft = window.localStorage.getItem(STORAGE_KEY);
      setRemoteLoaded(false);
      setBackendConfigured(false);

      if (localDraft) {
        try {
          setContent(JSON.parse(localDraft) as DemoContent);
          setSaveMessage('원격 로드 실패로 로컬 임시본을 불러왔습니다.');
        } catch {
          setContent(defaultDemoContent);
          setSaveMessage('원격 로드에 실패해 기본값을 사용합니다.');
        }
      } else {
        setContent(defaultDemoContent);
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
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    }
  }, [content, isLoading]);

  const saveToRemote = async (adminKey: string) => {
    if (!adminKey.trim()) {
      return { ok: false, message: '관리자 키를 입력해 주세요.' };
    }

    setIsSaving(true);
    setSaveMessage('Supabase에 저장 중입니다...');

    try {
      const response = await fetch('/api/demo-content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ content }),
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        const message = data.message ?? '저장에 실패했습니다.';
        setSaveMessage(message);
        return { ok: false, message };
      }

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
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

  const value = useMemo(
    () => ({
      content,
      setContent,
      resetContent: () => setContent(defaultDemoContent),
      reloadFromRemote,
      saveToRemote,
      isLoading,
      isSaving,
      saveMessage,
      remoteLoaded,
      backendConfigured,
    }),
    [content, isLoading, isSaving, saveMessage, remoteLoaded, backendConfigured],
  );

  return <DemoContentContext.Provider value={value}>{children}</DemoContentContext.Provider>;
}

export function useDemoContent() {
  const value = useContext(DemoContentContext);
  if (!value) throw new Error('useDemoContent must be used within DemoContentProvider');
  return value;
}
