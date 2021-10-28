import { selectUiState, selectZoom } from './ui.selectors';
import { ModelViewerState } from './../reducers/index';

describe('Ui Selectors', () => {
    let state: ModelViewerState;

    beforeEach(() => {
        state = {
            ui: {
                zoom: false
            }
        };
    });
    describe('selectUiState', () => {
        it('should return the feature state', () => {
            expect(selectUiState(state)).toBe(state.ui);
        });
    });
    describe('selectZoom', () => {
        it('should return the zoom', () => {
            expect(selectZoom(state)).toBe(false);
            const clone = JSON.parse(JSON.stringify(state));
            clone.ui.zoom = true;
            expect(selectZoom(clone)).toBe(true);
        });
    });
});
