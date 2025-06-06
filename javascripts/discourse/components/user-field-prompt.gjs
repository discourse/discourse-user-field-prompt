import Component from "@ember/component";
import { action } from "@ember/object";
import { tagName } from "@ember-decorators/component";
import DButton from "discourse/components/d-button";
import UserField from "discourse/components/user-field";
import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";

@tagName("")
export default class UserFieldPrompt extends Component {
  layoutName = "components/user-field-prompt";
  fields = null;
  isSaving = false;

  @action
  submitUserFields() {
    this.set("isSaving", true);

    const userFields = {};
    this.fields.forEach((field) => {
      userFields[field.userField.id] = field.value;
    });

    return ajax(`/u/${this.currentUser.username}.json`, {
      type: "PUT",
      data: { user_fields: userFields },
    })
      .catch(popupAjaxError)
      .finally(() => {
        this.set("isSaving", false);
      });
  }

  <template>
    {{#if this.currentUser}}
      <div class="user-field-prompt">
        <div class="fields-container">
          {{#each this.fields as |field|}}
            <UserField @field={{field.userField}} @value={{field.value}} />
          {{/each}}
        </div>

        <div class="actions">
          <DButton
            class="btn-primary save-changes"
            @action={{action "submitUserFields"}}
            @label="save"
            @isLoading={{this.isSaving}}
          />
        </div>
      </div>
    {{/if}}
  </template>
}
