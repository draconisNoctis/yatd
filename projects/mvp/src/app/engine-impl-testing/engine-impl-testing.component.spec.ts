import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EngineModule } from '@yatd/engine';
import { YatdUiModule } from '@yatd/ui';

import { EngineImplTestingComponent } from './engine-impl-testing.component';

describe('EngineImplTestingComponent', () => {
    let component: EngineImplTestingComponent;
    let fixture: ComponentFixture<EngineImplTestingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EngineImplTestingComponent],
            imports: [EngineModule, YatdUiModule]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EngineImplTestingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
