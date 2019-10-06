import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { TrainingService } from '../training.service';
import { UIService } from 'src/app/shared/ui.service';
import { Exercise } from '../exercise.model';
import * as fromTraining from '../training.reducer';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  // @Output() trainingStart = new EventEmitter<void>();
  // exercises: Exercise[] = [];
  // exercises: Exercise[];
  // isLoading = true;
  exercises$: Observable<Exercise[]>;
  isLoading$: Observable<boolean>;

  // private exerciseSubscription: Subscription;
  // private loadingSubscription: Subscription;

  constructor(
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) { }

  ngOnInit() {
    // this.exercises = this.trainingService.getAvailableExercises();
    // this.loadingSubscription = this.uiService.loadingStateChanged
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
    //   .subscribe(isLoading => {
    //   this.isLoading = isLoading;
    // });
    // this.exerciseSubscription = this.trainingService.exercisesChanged
    //   .subscribe(exercises => {
    //     this.exercises = exercises;
    //   });
    // this.trainingService.fetchAvailableExercises();
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    // this.trainingStart.emit();
    this.trainingService.startExercise(form.value.exercise);
  }

  // ngOnDestroy() {
  //   if (this.exerciseSubscription) {
  //     this.exerciseSubscription.unsubscribe();
  //   }
  //   if (this.loadingSubscription) {
  //     this.loadingSubscription.unsubscribe();
  //   }
  // }

}
