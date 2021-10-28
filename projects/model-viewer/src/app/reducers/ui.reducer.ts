import { createReducer, on } from '@ngrx/store';
import * as ui from '../actions/ui.actions';

export const uIFeatureKey = 'ui';

export interface UiState {
    zoom: boolean;
}

export const initialState: UiState = {
    zoom: false
};

export const reducer = createReducer(
    initialState,
    on(ui.toggleZoom, state => ({ ...state, zoom: !state.zoom })),
    on(ui.enableZoom, state => ({ ...state, zoom: true })),
    on(ui.disableZoom, state => ({ ...state, zoom: false }))
);
