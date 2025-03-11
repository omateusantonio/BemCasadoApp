import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ToastData } from '../../shared/interfaces/toast-data';
import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style } from '@angular/animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() data: ToastData = { 
    message: '',
    type: 'info',
    duration: 3000
  };
  
  private animationBuilder = inject(AnimationBuilder);
  private player?: AnimationPlayer;
  private timeoutId?: number;
  
  ngOnInit(): void {
    this.timeoutId = window.setTimeout(() => {
      this.fadeOut();
    }, this.data.duration);
  }
  
  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    if (this.player) {
      this.player.destroy();
    }
  }
  
  private fadeOut(): void {
    const factory: AnimationFactory = this.animationBuilder.build([
      style({ opacity: 1 }),
      animate('300ms ease-out', style({ opacity: 0, transform: 'translate(-50%, 20px)' }))
    ]);
    
    this.player = factory.create(document.querySelector('.alert'));
    this.player.play();
    
    this.player.onDone(() => {
      const customEvent = new CustomEvent('toast:done');
      window.dispatchEvent(customEvent);
    });
  }
}
