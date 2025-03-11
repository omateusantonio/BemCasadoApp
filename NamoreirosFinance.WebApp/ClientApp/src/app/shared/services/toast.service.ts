import { Injectable, createComponent, ApplicationRef, EnvironmentInjector, inject } from '@angular/core';
import { ToastData } from '../interfaces/toast-data';
import { ToastComponent } from '../../components/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private applicationRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);
  private activeToastRef: any = null;
  
  open(data: ToastData): void {
    if (this.activeToastRef) {
      this.close();
    }
    
    const toastData: ToastData = { 
      type: 'info',
      duration: 3000,
      ...data
    };
    
    const toastComponentRef = createComponent(ToastComponent, {
      environmentInjector: this.injector
    });
    
    toastComponentRef.instance.data = toastData;
    
    document.body.appendChild(toastComponentRef.location.nativeElement);
    
    this.applicationRef.attachView(toastComponentRef.hostView);
    
    this.activeToastRef = toastComponentRef;
    
    const handleToastDone = () => {
      this.close();
      window.removeEventListener('toast:done', handleToastDone);
    };
    
    window.addEventListener('toast:done', handleToastDone);
    
    if (toastData.duration && toastData.duration > 0) {
      setTimeout(() => {
        if (this.activeToastRef === toastComponentRef) {
          this.close();
        }
      }, toastData.duration + 300);
    }
  }
  
  close(): void {
    if (this.activeToastRef) {
      this.applicationRef.detachView(this.activeToastRef.hostView);
      
      const element = this.activeToastRef.location.nativeElement;
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      
      this.activeToastRef.destroy();
      this.activeToastRef = null;
    }
  }
}