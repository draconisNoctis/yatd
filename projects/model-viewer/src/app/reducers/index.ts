import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromUI from './ui.reducer';

export interface ModelViewerState {
    [fromUI.uIFeatureKey]: fromUI.UiState;
}

export const reducers: ActionReducerMap<ModelViewerState> = {
    [fromUI.uIFeatureKey]: fromUI.reducer
};

export const metaReducers: MetaReducer<ModelViewerState>[] = !environment.production
    ? [
          reducer => (state, action) => {
              console.log(`${action.type}`, action);
              return reducer(state, action);
          }
      ]
    : [];
