import { Injectable, createComponent, ApplicationRef, EnvironmentInjector, inject } from '@angular/core';
import { IToastData } from '../interfaces/toast-data.interface';
import { ToastComponent } from '../../components/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private _applicationRef = inject(ApplicationRef);
  private _injector = inject(EnvironmentInjector);
  private _activeToastRef: any = null;
  
  open(data: IToastData): void {
    if (this._activeToastRef) this._close();
    
    const toastData: IToastData = { 
      type: 'info',
      duration: 3000,
      ...data
    };
    
    const toastComponentRef = createComponent(ToastComponent, {
      environmentInjector: this._injector
    });
    
    toastComponentRef.instance.data = toastData;
    
    document.body.appendChild(toastComponentRef.location.nativeElement);
    
    this._applicationRef.attachView(toastComponentRef.hostView);
    
    this._activeToastRef = toastComponentRef;
    
    const handleToastDone = () => {
      this._close();
      window.removeEventListener('toast:done', handleToastDone);
    };
    
    window.addEventListener('toast:done', handleToastDone);
    
    if (toastData.duration && toastData.duration > 0) {
      setTimeout(() => {
        if (this._activeToastRef === toastComponentRef) {
          this._close();
        }
      }, toastData.duration + 300);
    }
  }
  
  private _close(): void {
    if (this._activeToastRef) {
      this._applicationRef.detachView(this._activeToastRef.hostView);
      
      const element = this._activeToastRef.location.nativeElement;
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      
      this._activeToastRef.destroy();
      this._activeToastRef = null;
    }
  }

  showSuccess(message: string): void {
    this.open({ type: 'success', message });
  }

  showError(message: string): void {
    this.open({ type: 'error', message });
  }

  showWarning(message: string): void {
    this.open({ type: 'warning', message });
  }

  showInfo(message: string): void {
    this.open({ type: 'info', message });
  }
}