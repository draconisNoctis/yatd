import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MvpComponent } from './mvp.component';

describe('AppComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [MvpComponent]
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(MvpComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
});
