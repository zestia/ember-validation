import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import validate from '@zestia/ember-validation';
import {
  present,
  maxLength,
  email,
  truthy,
  date
} from '@zestia/ember-validation/constraints';

export default class ApplicationController extends Controller {
  @tracked personErrors;
  @tracked mealErrors;

  person = {};

  personConstraints = {
    name() {
      return [
        present({ message: 'Please enter your name' }),
        maxLength({ max: 255 })
      ];
    },
    emailAddress() {
      return [present(), email()];
    },
    dateOfBirth() {
      return [present(), date({ format: 'yyyy-MM-dd' })];
    },
    terms() {
      return [truthy({ message: 'Please accept the terms' })];
    }
  };

  meals = [
    {
      name: 'Starter'
    },
    {
      name: 'Main'
    },
    {
      name: 'Dessert'
    }
  ];

  mealConstraints = (meal) => ({
    description() {
      return [present({ message: 'Please describe your meal' })];
    }
  });

  get personValidates() {
    return this.personErrors === null;
  }

  get mealsValidate() {
    return this.mealErrors === null;
  }

  @action
  handleSubmit(event) {
    event.preventDefault();
  }

  @action
  async validatePerson() {
    this.personErrors = await validate(this.person, this.personConstraints);
  }

  @action
  async validateMeals() {
    this.mealErrors = await validate(this.meals, this.mealConstraints);
  }
}
