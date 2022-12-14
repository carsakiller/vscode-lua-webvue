<template>
  <Addon :addon="props.addon">
    <template #badges>
      <span class="badge" v-if="commitDate" :title="commitDate">
        <CodeIcon icon="git-commit" /> {{ commitSince }}
      </span>
      <span class="badge" v-if="addon.hasPlugin">Plugin</span>
    </template>
    <template #controls>
      <vscode-button v-if="!installedAddonStore.loading && installed" disabled
        >Installed</vscode-button
      >
      <vscode-button v-if="processing && !installed" disabled
        >Installing...</vscode-button
      >
      <vscode-button
        v-if="!installedAddonStore.loading && !installed && !processing"
        :aria-label="`Install ${addon.name}`"
        :title="`Install ${addon.name}`"
        @click="download"
        >Install</vscode-button
      >
    </template>
  </Addon>
</template>

<script setup lang="ts">
import type { RemoteAddon } from "@/types/addon";

import { computed } from "vue";
import dayjs from "dayjs";

import Addon from "./Addon.vue";
import { useLocalAddonsStore } from "@/stores/localAddons.store";

import {
  provideVSCodeDesignSystem,
  vsCodeButton,
} from "@vscode/webview-ui-toolkit";
import { vscode } from "@/services/vscode.service";
import CodeIcon from "./CodeIcon.vue";
import { useRemoteAddonStore } from "@/stores/remoteAddons";

provideVSCodeDesignSystem().register(vsCodeButton());

const addonStore = useRemoteAddonStore();

const props = defineProps<{ addon: RemoteAddon }>();

const processing = computed(() => props.addon.processing);

const installedAddonStore = useLocalAddonsStore();
const installed = computed(
  () => installedAddonStore.getAddon(props.addon.name) !== undefined
);

const commitSince = computed(() =>
  dayjs(props.addon.latestCommitTimestamp)?.fromNow()
);
const commitDate = computed(() =>
  dayjs(props.addon.latestCommitTimestamp)?.format("MMMM DD, YYYY, h:mm A")
);

const download = () => {
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
</script>
