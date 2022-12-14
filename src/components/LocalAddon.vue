<template>
  <Addon :addon="props.addon">
    <template #badges>
      <span class="badge" v-if="props.addon.hasPlugin">Plugin</span>
      <span class="badge" v-if="installDateFromNow" :title="installDate"
        ><CodeIcon icon="cloud-download" />{{ installDateFromNow }}</span
      >
      <span v-if="updateAvailable" class="badge">
        <CodeIcon icon="repo-pull" />Update Available
      </span>
    </template>
    <template #quick-actions>
      <button
        @click="open"
        :title="`Open ${props.addon.name} in file explorer`"
      >
        <CodeIcon icon="folder" />
      </button>
    </template>
    <template #controls>
      <vscode-button
        v-if="updateAvailable"
        :disabled="processing"
        @click="update"
        :aria-label="`Update ${props.addon.name}`"
        :title="`Update ${props.addon.name}`"
        >Update</vscode-button
      >
      <vscode-button
        v-if="!props.addon.enabled"
        :disabled="!workspaceOpen || processing"
        :aria-label="`Enable ${props.addon.name}`"
        :title="
          !workspaceOpen
            ? 'There is no workspace open'
            : `Enable ${props.addon.name}`
        "
        @click="enable"
        appearance="primary"
        >Enable</vscode-button
      >
      <vscode-button
        v-if="props.addon.enabled"
        :disabled="!workspaceOpen || processing"
        :aria-label="`Disable ${props.addon.name}`"
        :title="
          !workspaceOpen
            ? 'There is no workspace open'
            : `Disable ${props.addon.name}`
        "
        @click="disable"
        appearance="primary"
        >Disable</vscode-button
      >
      <vscode-button
        :aria-label="`Uninstall ${props.addon.name}`"
        :title="`Uninstall ${props.addon.name}`"
        @click="uninstall"
        :disabled="processing"
        appearance="secondary"
        >Uninstall</vscode-button
      >
    </template>
  </Addon>
</template>

<script setup lang="ts">
import type { LocalAddon } from "@/types/addon";

import { computed } from "vue";
import dayjs from "dayjs";
import CodeIcon from "@/components/CodeIcon.vue";
import Addon from "./Addon.vue";
import {
  provideVSCodeDesignSystem,
  vsCodeButton,
} from "@vscode/webview-ui-toolkit";
import { useAppStore } from "@/stores/app";
import { vscode } from "@/services/vscode.service";
import { useLocalAddonsStore } from "@/stores/localAddons.store";

provideVSCodeDesignSystem().register(vsCodeButton());

const appStore = useAppStore();
const addonStore = useLocalAddonsStore();

const props = defineProps<{ addon: LocalAddon }>();

const processing = computed(() => props.addon.processing);

const installDateFromNow = computed(() =>
  dayjs(props.addon.installTimestamp).fromNow()
);
const installDate = computed(() =>
  dayjs(props.addon.installTimestamp).local().format("MMMM DD, YYYY, h:mm A")
);
const updateAvailable = computed(() => props.addon.hasUpdate);

const workspaceOpen = computed(() => appStore.workspaceOpen);

const uninstall = () => {
  vscode.postMessage("uninstall", {
    name: props.addon.name,
  });
  const storeVersion = addonStore.addons.find(
    (addon) => addon.name === props.addon.name
  );
  if (storeVersion) {
    storeVersion.processing = true;
  }
};

const disable = () => {
  vscode.postMessage("disable", {
    name: props.addon.name,
  });
  const storeVersion = addonStore.addons.find(
    (addon) => addon.name === props.addon.name
  );
  if (storeVersion) {
    storeVersion.processing = true;
  }
};

const enable = () => {
  vscode.postMessage("enable", {
    name: props.addon.name,
  });
  const storeVersion = addonStore.addons.find(
    (addon) => addon.name === props.addon.name
  );
  if (storeVersion) {
    storeVersion.processing = true;
  }
};

const update = () => {
  vscode.postMessage("install", {
    name: props.addon.name,
  });
  const storeVersion = addonStore.addons.find(
    (addon) => addon.name === props.addon.name
  );
  if (storeVersion) {
    storeVersion.processing = true;
  }
};

const open = () => {
  vscode.postMessage("open", {
    name: props.addon.name,
  });
};
</script>
