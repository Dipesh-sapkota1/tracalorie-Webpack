import Storage from './Storage';

class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories(0);
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();

    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaning();
    this._displayCalorieProgress();
  }

  // Public methods API//
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    Storage.updateCalories(this._totalCalories);
    Storage.saveMeal(meal);
    this._displayNewMeal(meal);
    this._render();
  }
  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);

    if (index !== -1) {
      const meal = this._meals[index];
      this._totalCalories -= meal.calories;
      Storage.updateCalories(this._totalCalories);
      this._meals.splice(index, 1);
      Storage.removeMeal(id);
      this._render();
    }
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    Storage.updateCalories(this._totalCalories);
    Storage.saveWorkout(workout);
    this._displayNewWorkout(workout);
    this._render();
  }
  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);

    if (index !== -1) {
      const workout = this._workouts[index];
      this._totalCalories += workout.calories;
      Storage.updateCalories(this._totalCalories);
      this._workouts.splice(index, 1);
      Storage.removeWorkout(id);
      this._render();
    }
  }
  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    this._render();
  }
  setLimit(calorieLimit) {
    this._calorieLimit = calorieLimit;
    Storage.setCalorieLimit(calorieLimit);
    this._displayCaloriesLimit();
    this._render();
  }
  loadItems() {
    this._meals.forEach((meal) => this._displayNewMeal(meal));
    this._workouts.forEach((workout) => this._displayNewWorkout(workout));
  }
  // Private Methods
  _displayCaloriesTotal() {
    const totalCaloriesEl = document.getElementById("calories-total");
    totalCaloriesEl.innerHTML = this._totalCalories;
  }
  _displayCaloriesLimit() {
    const caloriesLimitEl = document.getElementById("calories-limit");
    caloriesLimitEl.innerHTML = this._calorieLimit;
  }
  _displayCaloriesConsumed() {
    const caloriesConsumedEl = document.getElementById("calories-consumed");

    const consumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );

    caloriesConsumedEl.innerHTML = consumed;
  }
  _displayCaloriesBurned() {
    const caloriesBurnedEl = document.getElementById("calories-burned");

    const burned = this._workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    );

    caloriesBurnedEl.innerHTML = burned;
  }
  _displayCaloriesRemaning() {
    const claoriesRemaningEl = document.getElementById("calories-remaining");

    const remaning = this._calorieLimit - this._totalCalories;

    claoriesRemaningEl.innerHTML = remaning;

    if (remaning < 0) {
      claoriesRemaningEl.parentElement.parentElement.classList.remove(
        "bg-light"
      );
      claoriesRemaningEl.parentElement.parentElement.classList.add("bg-danger");
      document
        .getElementById("calorie-progress")
        .classList.remove("bg-success");
      document.getElementById("calorie-progress").classList.add("bg-danger");
    } else {
      claoriesRemaningEl.parentElement.parentElement.classList.remove(
        "bg-danger"
      );
      claoriesRemaningEl.parentElement.parentElement.classList.add("bg-light");
      document.getElementById("calorie-progress").classList.remove("bg-danger");
      document.getElementById("calorie-progress").classList.add("bg-success");
    }
  }
  _displayCalorieProgress() {
    const calorieProgressEl = document.getElementById("calorie-progress");

    const percentage = (this._totalCalories / this._calorieLimit) * 100;
    const width = Math.min(percentage, 100);

    calorieProgressEl.style.width = `${width}%`;
  }
  _displayNewMeal(meal) {
    const mealItems = document.getElementById("meal-items");
    const mealEl = document.createElement("div");
    mealEl.classList.add("card", "my-2");
    mealEl.setAttribute("data-id", meal.id);
    mealEl.innerHTML = ` 
    <div class="card-body">
    <div class="d-flex align-items-center justify-content-between">
      <h4 class="mx-1">${meal.name}</h4>
      <div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">
        ${meal.calories}
      </div>
      <button class="delete btn btn-danger btn-sm mx-2">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>
    `;
    mealItems.appendChild(mealEl);
  }
  _displayNewWorkout(workout) {
    const workoutItems = document.getElementById("workout-items");
    const workoutEl = document.createElement("div");
    workoutEl.classList.add("card", "my-2");
    workoutEl.setAttribute("data-id", workout.id);
    workoutEl.innerHTML = ` 
    <div class="card-body">
    <div class="d-flex align-items-center justify-content-between">
      <h4 class="mx-1">${workout.name}</h4>
      <div class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5">
        ${workout.calories}
      </div>
      <button class="delete btn btn-danger btn-sm mx-2">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>
    `;
    workoutItems.appendChild(workoutEl);
  }
  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaning();
    this._displayCalorieProgress();
  }
}

export default CalorieTracker;