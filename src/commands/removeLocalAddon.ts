import { useLocalAddonsStore } from "@/stores/localAddons.store";

/** Remove a `LocalAddon` from the `localAddonStore` state.
 *
 * Used when uninstalling an addon. */
export default (message: { data: { name: string } }) => {
  const addonStore = useLocalAddonsStore();

  const index = addonStore.addons.findIndex((addon) => {
    return addon.name === message.data.name;
  });

  if (index < 0) {
    console.warn(`Could not find "${message.data.name}" addon to remove`);
    return;
  }

  addonStore.$patch((state) => {
    state.addons.splice(index, 1);
  });
};
