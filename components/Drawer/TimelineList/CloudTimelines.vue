<template>
  <div class="flex flex-col">
    <div v-if="list && list.length > 0">
      <cloud-timeline-item
        v-for="item in list"
        :key="item.name"
        :item="item"
        @refresh="refreshList"
      ></cloud-timeline-item>
    </div>
  </div>
</template>

<script lang="ts">
import CloudTimelineItem from "./CloudTimelineItem.vue";
import { getStorage, ref, listAll, StorageReference } from "firebase/storage";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import Vue from "vue";

export default Vue.extend({
  components: { CloudTimelineItem },
  data() {
    return {
      uid: "",
      list: [] as StorageReference[],
    };
  },
  watch: {
    async uid(val, oldVal) {
      await this.refreshList();
    },
  },
  mounted() {
    onAuthStateChanged(getAuth(), this.userUpdated);
  },
  methods: {
    async refreshList() {
      if (!this.uid) {
        this.list = [];
      }
      const storage = getStorage();
      const listRef = ref(storage, this.uid);
      const listResults = await listAll(listRef);
      this.list = listResults.items;
    },
    userUpdated(user: User | null) {
      if (user) {
        this.uid = user.uid;
      } else {
        this.uid = "";
      }
    },
  },
});
</script>

<style>
</style>