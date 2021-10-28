import * as fromUi from './ui.actions';

describe('toggleZoom', () => {
    it('should return an action', () => {
        expect(fromUi.toggleZoom().type).toBe('[Ui] Toggle Zoom');
    });
});

describe('enableZoom', () => {
    it('should return an action', () => {
        expect(fromUi.enableZoom().type).toBe('[Ui] Enable Zoom');
    });
});

describe('disableZoom', () => {
    it('should return an action', () => {
        expect(fromUi.disableZoom().type).toBe('[Ui] Disable Zoom');
    });
});
