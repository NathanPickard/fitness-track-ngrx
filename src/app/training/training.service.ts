import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';

@Injectable()
export class TrainingService {
  // exerciseChanged = new Subject<Exercise>();
  // exercisesChanged = new Subject<Exercise[]>();
  // finishedExercisesChanged = new Subject<Exercise[]>();

  // private availableExercises: Exercise[] = [
  //   { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
  //   { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
  //   { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
  //   { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 },
  // ];

  // private availableExercises: Exercise[] = [];
  // private runningExercise: Exercise;
  private fbSubs: Subscription[] = [];
  // private finishedExercises: Exercise[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>) { }

  // getAvailableExercises() {
  fetchAvailableExercises() {
    // return this.availableExercises.slice();
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(this.db
      .collection<Exercise>('availableExercises')
      .snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data().name,
            duration: doc.payload.doc.data().duration,
            calories: doc.payload.doc.data().calories
          };
        });
      }))
      .subscribe((exercises: Exercise[]) => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        // this.availableExercises = exercises;
        // this.exercisesChanged.next([...this.availableExercises]);
        this.store.dispatch(new Training.SetAvailableTrainings(exercises));
      }, error => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar('Fetching Exercises failed, please try again later', null, 4000);
        // this.exercisesChanged.next(null);
      }));
  }

  startExercise(selectedId: string) {
    // this.db.doc('availableExercises/' + selectedId).update({ lastSelected: new Date() });
    // this.runningExercise = this.availableExercises.find(
    //   ex => ex.id === selectedId);
    // this.exerciseChanged.next({ ...this.runningExercise });
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      // this.exercises.push({
      this.addDataToDatabase({
        // ...this.runningExercise,
        ...ex,
        date: new Date(),
        state: 'completed'
      });
      // this.runningExercise = null;
      // this.exerciseChanged.next(null);
      this.store.dispatch(new Training.StopTraining());
    });
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      // this.exercises.push({
      this.addDataToDatabase({
        // ...this.runningExercise,
        ...ex,
        duration: ex.duration * (progress / 100),
        calories: ex.calories * (progress / 100),
        date: new Date(),
        state: 'cancelled'
      });
      // this.runningExercise = null;
      // this.exerciseChanged.next(null);
      this.store.dispatch(new Training.StopTraining());
    });
    // this.exercises.push({
    // this.addDataToDatabase({
    //   ...this.runningExercise,
    //   duration: this.runningExercise.duration * (progress / 100),
    //   calories: this.runningExercise.calories * (progress / 100),
    //   date: new Date(),
    //   state: 'cancelled'
    // });
    // this.runningExercise = null;
    // this.exerciseChanged.next(null);
    // this.store.dispatch(new Training.StopTraining());
  }

  // getRunningExercise() {
  //   return { ...this.runningExercise };
  // }

  fetchCompletedOrCancelledExercises() {
    // return this.exercises.slice();
    this.fbSubs.push(this.db
      .collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        // this.finishedExercisesChanged.next(exercises);
        this.store.dispatch(new Training.SetFinishedTrainings(exercises));
      }));
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
