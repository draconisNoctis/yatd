import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MvpComponent } from './mvp.component';

describe('AppComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [MvpComponent],
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(MvpComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have as title 'mvp'`, () => {
        const fixture = TestBed.createComponent(MvpComponent);
        const app = fixture.componentInstance;
        expect(app.title).toEqual('mvp');
    });

    it('should render title', () => {
        const fixture = TestBed.createComponent(MvpComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.content span')?.textContent).toContain(
            'mvp app is running!'
        );
    });
});
