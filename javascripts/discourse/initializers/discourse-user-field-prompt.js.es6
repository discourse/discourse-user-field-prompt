import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";
import { withPluginApi } from "discourse/lib/plugin-api";
import Site from "discourse/models/site";

function _attachUserFieldPrompt(api, element) {
  const currentUser = api.getCurrentUser();
  if (!currentUser) {
    return;
  }

  const fieldsElement = element.querySelector(".d-wrap[data-wrap=user-field]");

  if (!fieldsElement) {
    return;
  }

  const names = (fieldsElement.dataset.names || "").split(",").filter(Boolean);
  const maxHeight = Math.min(names.length * 100 + 50, 600);

  fieldsElement.style.height = maxHeight + "px";

  fieldsElement.innerHTML = '<div class="spinner"></div>';

  ajax(`/u/${currentUser.username}.json`, {
    type: "GET",
  })
    .then((result) => {
      fieldsElement.innerHTML = "";

      if (result) {
        const userFields = result.user.user_fields;
        const fields = [];

        names.forEach((name) => {
          const field = Site.currentProp("user_fields").findBy("name", name);

          if (!field) {
            /* eslint-disable no-console */
            console.error(
              `Couldn’t find "${name}" in user fields: ${Site.currentProp(
                "user_fields"
              )
                .map((f) => `"${f.name}"`)
                .join(", ")}`
            );
            /* eslint-enable no-console */
            return;
          }

          const value = userFields[field.id];

          fields.push({
            value,
            userField: field,
          });
        });

        const component = api.container.owner
          .factoryFor("component:user-field-prompt")
          .create({
            fields,
          });

        component.renderer.appendTo(component, fieldsElement);
      }
    })
    .catch(popupAjaxError);
}

export default {
  name: "discourse-user-field-prompt",

  initialize() {
    withPluginApi("0.11.2", (api) => {
      api.decorateCookedElement(
        (element, post) => {
          _attachUserFieldPrompt(api, element, post);
        },
        {
          onlyStream: true,
          id: "discourse-user-field-prompt",
        }
      );
    });
  },
};
