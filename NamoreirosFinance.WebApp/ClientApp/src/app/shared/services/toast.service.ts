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
    if (this._activeToastRef) this.close();
    
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
      this.close();
      window.removeEventListener('toast:done', handleToastDone);
    };
    
    window.addEventListener('toast:done', handleToastDone);
    
    if (toastData.duration && toastData.duration > 0) {
      setTimeout(() => {
        if (this._activeToastRef === toastComponentRef) {
          this.close();
        }
      }, toastData.duration + 300);
    }
  }
  
  close(): void {
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
}