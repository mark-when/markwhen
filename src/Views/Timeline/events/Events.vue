<script setup lang="ts">
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import EventRow from "@/Views/Timeline/Events/Event/EventRow.vue";
import { useTransformStore } from "@/Markwhen/transformStore";
import EventSection from "@/Views/Timeline/Events/EventGroup/Section/EventSection.vue";
import EventGroup from "@/Views/Timeline/Events/EventGroup/Group/EventGroup.vue";
import NowLine from "../Events/NowLine.vue";
import { isEditable } from "@/injectionKeys";
import { inject } from "vue";
import NewEvent from "./NewEvent/NewEvent.vue";

const transformStore = useTransformStore();
const timelineStore = useTimelineStore();

const editable = inject(isEditable);
</script>

<template>
  <div
    id="events"
    class="flex flex-col relative"
    :style="`min-width: ${timelineStore.distanceBetweenBaselineDates}px;`"
  >
    <div class="h-24"></div>
    <now-line />
    <template v-for="(event, i) in transformStore.transformedEvents">
      <template v-if="Array.isArray(event)">
        <event-group
          v-if="event.style === 'group'"
          :eventGroup="event"
          :key="
            event.reduce(
              (prev, curr) => prev + curr.eventString,
              'group' + event.title + (event.tags || []).join(',')
            )
          "
        />
        <event-section
          v-else
          :eventGroup="event"
          :key="
            event.reduce(
              (prev, curr) => prev + curr.eventString,
              'section' + event.title + (event.tags || []).join(',')
            )
          "
        />
      </template>
      <event-row
        v-else
        :key="event.eventString.substring(0, 50)"
        :event="event"
      />
    </template>
    <new-event v-if="editable" />
    <div style="height: 90vh"></div>
  </div>
</template>

<style scoped></style>
