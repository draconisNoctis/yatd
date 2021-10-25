import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FpsComponent } from './fps.component';

@NgModule({
    declarations: [FpsComponent],
    imports: [CommonModule],
    exports: [FpsComponent]
})
export class FpsModule {}
