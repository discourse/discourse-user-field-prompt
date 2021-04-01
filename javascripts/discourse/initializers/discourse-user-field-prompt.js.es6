import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";
import { withPluginApi } from "discourse/lib/plugin-api";
import Site from "discourse/models/site";

function _attachUserFieldPrompt(api, element) {
  const currentUser = api.getCurrentUser();
  if (!currentUser) {
    return;
  }

  const fieldElements = element.querySelectorAll(
    ".d-wrap[data-wrap=user-field]"
  );

  if (!fieldElements.length) {
    return;
  }

  ajax(`/u/${currentUser.username}.json`, {
    type: "GET",
  })
    .then((result) => {
      if (result) {
        const userFields = result.user.user_fields;

        fieldElements.forEach((fieldElement) => {
          const name = fieldElement.dataset.name;
          const field = Site.currentProp("user_fields").findBy("name", name);

          if (!field) {
            return;
          }

          const value = userFields[field.id];

          const component = api.container.owner
            .factoryFor("component:user-field-prompt")
            .create({
              field,
              value,
            });
          component.renderer.appendTo(component, fieldElement);
        });
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
