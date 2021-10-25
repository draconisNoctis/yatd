import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'yatd-fps',
    templateUrl: './fps.component.html',
    styleUrls: ['./fps.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FpsComponent {
    @Input()
    fps?: number;

    @Input()
    frameTime?: number;
}
