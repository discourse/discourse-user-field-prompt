import Component from "@ember/component";
import { action } from "@ember/object";
import { tagName } from "@ember-decorators/component";
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
}
