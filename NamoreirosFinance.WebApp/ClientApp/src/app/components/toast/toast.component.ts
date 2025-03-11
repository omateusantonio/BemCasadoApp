import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { IToastData } from '../../shared/interfaces/toast-data.interface';
import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style } from '@angular/animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() data: IToastData = { 
    message: '',
    type: 'info',
    duration: 3000
  };
  
  private _animationBuilder = inject(AnimationBuilder);
  private _player?: AnimationPlayer;
  private _timeoutId?: number;
  
  ngOnInit(): void {
    this._timeoutId = window.setTimeout(() => {
      this._fadeOut();
      
    }, this.data.duration);
  }
  
  ngOnDestroy(): void {
    if (this._timeoutId) clearTimeout(this._timeoutId);
    if (this._player) this._player.destroy();
  }

  getSvgPath(): string {
    switch (this.data.type) {
      case "success":
        return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
      case "error":
        return "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z";
      case "warning":
        return "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z";
      default:
        return "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
    }
  }
  
  private _fadeOut(): void {
    const factory: AnimationFactory = this._animationBuilder.build([
      style({ opacity: 1 }),
      animate('300ms ease-out', style({ opacity: 0, transform: 'translate(-50%, 20px)' }))
    ]);
    
    this._player = factory.create(document.querySelector('.alert'));
    this._player.play();
    
    this._player.onDone(() => {
      const customEvent = new CustomEvent('toast:done');
      window.dispatchEvent(customEvent);
    });
  }
}
