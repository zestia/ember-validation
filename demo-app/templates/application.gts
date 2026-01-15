import Route from 'ember-route-template';
import set from 'ember-set-helper/helpers/set';
import { on } from '@ember/modifier';
import { get } from '@ember/helper';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import validate from '@zestia/ember-validation';
import { pick } from '@nullvoxpopuli/ember-composable-helpers';
import {
  present,
  maxLength,
  email,
  truthy,
  date,
} from '@zestia/ember-validation/constraints';
const { stringify } = JSON;

const Errors = <template>
  {{#if @errors.length}}
    <ul>
      {{#each @errors as |error|}}
        <li>
          {{error}}
        </li>
      {{/each}}
    </ul>
  {{/if}}
</template>;

class ApplicationRoute extends Component {
  @tracked personErrors;
  @tracked mealErrors;

  person = {};

  personConstraints = {
    name() {
      return [
        present({ message: 'Please enter your name' }),
        maxLength({ max: 255 }),
      ];
    },
    emailAddress() {
      return [present(), email()];
    },
    dateOfBirth() {
      return [
        present(),
        date({
          format: 'dd/MM/yy',
          message: 'Invalid date expecting dd/mm/yy',
        }),
      ];
    },
    terms() {
      return [truthy({ message: 'Please accept the terms' })];
    },
  };

  meals = [
    {
      name: 'Starter',
    },
    {
      name: 'Main',
    },
    {
      name: 'Dessert',
    },
  ];

  mealConstraints = (meal) => ({
    description() {
      return [
        present({ message: `Please describe your ${meal.name.toLowerCase()}` }),
      ];
    },
  });

  get personValidates() {
    return this.personErrors === null;
  }

  get personStringErrors() {
    return stringify(this.personErrors, null, 2);
  }

  get mealStringErrors() {
    return stringify(this.mealErrors, null, 2);
  }

  get mealsValidate() {
    return this.mealErrors === null;
  }

  handleSubmit = (event) => {
    event.preventDefault();
  };

  validatePerson = async () => {
    this.personErrors = await validate(this.person, this.personConstraints);
  };

  validateMeals = async () => {
    this.mealErrors = await validate(this.meals, this.mealConstraints);
  };

  <template>
    {{! template-lint-disable no-action-on-submit-button }}

    <h1>
      @zestia/ember-validation
    </h1>

    <p>
      <a
        href="https://github.com/zestia/ember-validation/tree/master/demo/templates/application.gjs"
      >
        View the code
      </a>
    </p>

    <br />

    <form
      novalidate
      aria-label="Validating an object"
      {{on "submit" this.handleSubmit}}
    >
      <fieldset>
        <legend>
          An object
        </legend>

        <p>
          <input
            type="text"
            value={{this.person.name}}
            placeholder="Name"
            aria-label="Name"
            {{on "change" (pick "target.value" (set this.person "name"))}}
          />
        </p>
        <Errors @errors={{this.personErrors.name}} />

        <p>
          {{this.errors.person.emailAddress}}
          <input
            type="email"
            value={{this.person.emailAddress}}
            placeholder="Email address"
            aria-label="Email address"
            {{on
              "change"
              (pick "target.value" (set this.person "emailAddress"))
            }}
          />
        </p>
        <Errors @errors={{this.personErrors.emailAddress}} />

        <p>
          {{this.errors.person.dateOfBirth}}
          <input
            type="text"
            value={{this.person.dateOfBirth}}
            placeholder="Date of birth"
            aria-label="Date of birth"
            {{on
              "change"
              (pick "target.value" (set this.person "dateOfBirth"))
            }}
          />
        </p>
        <Errors @errors={{this.personErrors.dateOfBirth}} />

        <p>
          {{this.errors.person.terms}}
          <label>
            <input
              type="checkbox"
              checked={{this.person.terms}}
              {{on "change" (pick "target.checked" (set this.person "terms"))}}
            />
            Agree to terms
          </label>
        </p>
        <Errors @errors={{this.personErrors.terms}} />

        <p>
          <button type="submit" {{on "click" this.validatePerson}}>
            Submit
          </button>
        </p>
      </fieldset>

      <fieldset>
        <legend>
          Validates:
          {{if this.personValidates "✔" "✗"}}
        </legend>
        <pre>
      {{~this.personStringErrors~}}
    </pre>
      </fieldset>
    </form>

    <form
      novalidate
      data-errors={{this.mealStringErrors}}
      aria-label="Validating an array of objects"
      {{on "submit" this.handleSubmit}}
    >
      <fieldset>
        <legend>
          An array of objects
        </legend>

        {{#each this.meals as |meal index|}}
          <fieldset>
            <legend>
              {{meal.name}}
            </legend>

            <p>
              <input
                type="text"
                value={{meal.description}}
                placeholder="Description"
                aria-label="Description"
                {{on "change" (pick "target.value" (set meal "description"))}}
              />
            </p>
            <Errors @errors={{get (get this.mealErrors index) "description"}} />
          </fieldset>
        {{/each}}

        <p>
          <button type="submit" {{on "click" this.validateMeals}}>
            Submit
          </button>
        </p>
      </fieldset>

      <fieldset>
        <legend>
          Validates:
          {{if this.mealsValidate "✔" "✗"}}
        </legend>
        <pre>
      {{~this.mealStringErrors~}}
    </pre>
      </fieldset>
    </form>

    {{outlet}}

    {{! template-lint-disable no-inline-styles }}
    <a href="https://github.com/zestia/ember-validation">
      <img
        style="position: absolute; top: 0; right: 0; border: 0;"
        width="149"
        height="149"
        src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149"
        class="attachment-full size-full"
        alt="Fork me on GitHub"
        data-recalc-dims="1"
      />
    </a>
  </template>
}

export default Route(ApplicationRoute);
