import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/AppShell';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { LoginPage, NotesPage, ArchivePage, TrashPage } from '@/pages/Notes';
import { SettingsPage } from '@/pages/Settings';
import { NoteEditor } from '@/components/notes/NoteEditor';

// Initialize TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AuthenticatedApp: React.FC = () => {
  return (
    <AppShell>
      <Routes>
        <Route index element={<Navigate to="/notes" replace />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/trash" element={<TrashPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/notes" replace />} />
      </Routes>
      
      {/* Global Modals */}
      <NoteEditor />
    </AppShell>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/Rawtes/">
        <AuthGuard fallback={<LoginPage />}>
          <Routes>
            <Route path="/*" element={<AuthenticatedApp />} />
          </Routes>
        </AuthGuard>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
