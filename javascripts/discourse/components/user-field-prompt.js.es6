import { action } from "@ember/object";
import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";
import Component from "@ember/component";

export default Component.extend({
  classNames: ["user-field-prompt"],
  layoutName: "components/user-field-prompt",
  field: null,
  value: null,
  isSaving: false,

  @action
  submitUserField() {
    this.set("isSaving", true);

    return ajax(
      `/u/${this.currentUser.username}.json?user_fields[${this.field.id}]=${this.value}`,
      {
        type: "PUT",
      }
    )
      .catch(popupAjaxError)
      .finally(() => {
        this.set("isSaving", false);
      });
  },
});
