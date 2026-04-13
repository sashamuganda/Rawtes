import { useEffect, useState } from 'react';
import { useAppStore } from '@/store';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Copy, ExternalLink, Loader2 } from 'lucide-react';

/* --- AuthGuard --- */
export const AuthGuard: React.FC<{ children: React.ReactNode; fallback: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => {
  const { status, initializeAuth } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (status !== 'authenticated') {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/* --- DeviceCodeModal --- */
export const DeviceCodeModal: React.FC = () => {
  const { deviceData, status } = useAppStore();
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (deviceData?.expires_in) {
      setTimeLeft(deviceData.expires_in);
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [deviceData]);

  const copyCode = () => {
    if (deviceData?.user_code) {
      navigator.clipboard.writeText(deviceData.user_code);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal 
      open={status === 'polling' && !!deviceData} 
      onOpenChange={() => {}} 
      title="Sign in with GitHub"
    >
      <div className="flex flex-col items-center gap-6 py-4 text-center">
        <p className="text-text-secondary">
          Enter this code on GitHub to authorize Rawtes:
        </p>

        <div className="flex w-full items-center justify-between rounded-lg bg-surface-hover p-6 border border-border">
          <span className="text-3xl font-mono font-bold tracking-widest text-text-primary">
            {deviceData?.user_code}
          </span>
          <Button variant="ghost" size="icon" onClick={copyCode} title="Copy code">
            <Copy className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex w-full flex-col gap-3">
          <Button 
            className="w-full gap-2" 
            size="lg"
            onClick={() => window.open(deviceData?.verification_uri, '_blank')}
          >
            Open GitHub <ExternalLink className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center justify-center gap-2 text-sm text-text-placeholder">
            <Loader2 className="h-4 w-4 animate-spin" />
            Waiting for approval... (Expires in {formatTime(timeLeft)})
          </div>
        </div>
      </div>
    </Modal>
  );
};
