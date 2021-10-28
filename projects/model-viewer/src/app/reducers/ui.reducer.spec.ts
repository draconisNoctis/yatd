import { disableZoom, enableZoom, toggleZoom } from '../actions/ui.actions';
import { reducer, initialState } from './ui.reducer';

describe('UI Reducer', () => {
    describe('an unknown action', () => {
        it('should return the previous state', () => {
            const action = {} as any;

            const result = reducer(initialState, action);

            expect(result).toBe(initialState);
        });
    });

    describe('toggleZoom', () => {
        it('should toggle the zoom', () => {
            const action = toggleZoom();

            const result = reducer(initialState, action);

            expect(result).toEqual({ zoom: true });
            expect(reducer(result, action)).toEqual({ zoom: false });
        });
    });

    describe('enableZoom', () => {
        it('should enable the zoom', () => {
            const action = enableZoom();

            const result = reducer(initialState, action);

            expect(result).toEqual({ zoom: true });
            expect(reducer(result, action)).toEqual({ zoom: true });
        });
    });

    describe('disableZoom', () => {
        it('should disable the zoom', () => {
            const action = disableZoom();

            const result = reducer(initialState, action);

            expect(result).toEqual({ zoom: false });
            expect(reducer(result, action)).toEqual({ zoom: false });
        });
    });
});
