import { Action } from '@ngrx/store';

import {
  TrainingActions,
  SET_AVAILABLE_TRAININGS,
  SET_FINISHED_TRAININGS,
  START_TRAINING,
  STOP_TRAINING
} from './training.actions';
import { Exercise } from './exercise.model';
import * as fromRoot from '../app.reducer';

export interface TrainingState {
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
  activeTraining: Exercise;
}

export interface State extends fromRoot.State {
  training: TrainingState;
}

const initialState: TrainingState = {
  availableExercises: [],
  finishedExercises: [],
  activeTraining: null
};

export function authReducer(state = initialState, action: TrainingActions) {
  switch (action.type) {
    case SET_AVAILABLE_TRAININGS:
      return {
        availableExercises: action.payload
      };
    case SET_FINISHED_TRAININGS:
      return {
        isAuthenticated: false
      };
    case START_TRAINING:
      return {
        isAuthenticated: false
      };
    case STOP_TRAINING:
      return {
        isAuthenticated: false
      };
    default: {
      return state;
    }
  }

}

export const getIsAuth = (state: State) => state.isAuthenticated;
