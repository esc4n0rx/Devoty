// lib/service-worker.ts
export class ServiceWorkerManager {
  private static instance: ServiceWorkerManager;
  private registration: ServiceWorkerRegistration | null = null;
  private updateAvailable = false;

  static getInstance(): ServiceWorkerManager {
    if (!ServiceWorkerManager.instance) {
      ServiceWorkerManager.instance = new ServiceWorkerManager();
    }
    return ServiceWorkerManager.instance;
  }

  async register(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        
        console.log('SW registered:', this.registration);
        
        // Escutar por atualizações
        this.registration.addEventListener('updatefound', () => {
          this.handleUpdateFound();
        });

        // Escutar mensagens do service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          this.handleMessage(event);
        });

        // Verificar se há uma atualização esperando
        if (this.registration.waiting) {
          this.updateAvailable = true;
          this.showUpdateNotification();
        }

      } catch (error) {
        console.error('SW registration failed:', error);
      }
    }
  }

  private handleUpdateFound(): void {
    if (!this.registration) return;

    const newWorker = this.registration.installing;
    if (!newWorker) return;

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // Nova versão disponível
        this.updateAvailable = true;
        this.showUpdateNotification();
      }
    });
  }

  private handleMessage(event: MessageEvent): void {
    if (event.data && event.data.type === 'SW_UPDATED') {
      console.log(`App updated to version: ${event.data.version}`);
      this.showUpdateSuccessMessage(event.data.version);
    }
  }

  private showUpdateNotification(): void {
    // Criar notificação customizada ou usar toast
    if (this.shouldShowUpdatePrompt()) {
      const shouldUpdate = confirm(
        'Uma nova versão do app está disponível! Deseja atualizar agora?'
      );
      
      if (shouldUpdate) {
        this.applyUpdate();
      }
    }
  }

  private shouldShowUpdatePrompt(): boolean {
    // Lógica para decidir quando mostrar o prompt
    // Por exemplo, não mostrar se o usuário atualizou recentemente
    const lastUpdate = localStorage.getItem('lastSWUpdate');
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    return !lastUpdate || (now - parseInt(lastUpdate)) > oneHour;
  }

  public applyUpdate(): void {
    if (!this.registration?.waiting) return;

    // Dizer ao service worker para tomar controle
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    
    // Recarregar a página após um breve delay
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
    // Salvar timestamp da atualização
    localStorage.setItem('lastSWUpdate', Date.now().toString());
  }

  private showUpdateSuccessMessage(version: string): void {
    // Mostrar mensagem de sucesso
    console.log(`✅ App atualizado para versão ${version}`);
    
    // Se você estiver usando toast notifications:
    // toast.success(`App atualizado para versão ${version}!`);
  }

  public checkForUpdates(): void {
    if (this.registration) {
      this.registration.update();
    }
  }

  public isUpdateAvailable(): boolean {
    return this.updateAvailable;
  }
}