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
