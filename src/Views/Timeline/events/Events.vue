<script setup lang="ts">
import { useTimelineStore } from "@/Views/Timeline/timelineStore";
import EventRow from "@/Views/Timeline/Events/Event/EventRow.vue";
import { useTransformStore } from "@/Markwhen/transformStore";
import EventSection from "@/Views/Timeline/Events/EventGroup/Section/EventSection.vue";
import EventGroup from "@/Views/Timeline/Events/EventGroup/Group/EventGroup.vue";
import NowLine from "../events/NowLine.vue";

const transformStore = useTransformStore();
const timelineStore = useTimelineStore();
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
    <!-- <div class="w-full relative mt-2" v-if="$store.state.editable">
      <button title="Click and drag to create new event" class="
          h-3
          rounded-full
          border
          flex
          items-center
          justify-center
          flex-shrink-0
          relative
          border-transparent
          bg-transparent
          hover:border-white hover:bg-white
          text-slate-600
          hover:bg-white hover:shadow
          dark:text-slate-100 dark:hover:border-gray-600 dark:hover:bg-gray-600
        " :class="
          creating
            ? 'dark:border-gray-600 dark:bg-gray-600 bg-white border-white shadow'
            : ''
        " :style="`left: ${newEventPosition[0].left}px; width: ${newEventPosition[1].left - newEventPosition[0].left
}px;`" @mousedown.prevent.stop="$emit('startMakingEvent', $event)"
        @touchstart.prevent.stop="$emit('startMakingEvent', $event)">
        +
      </button>
    </div> -->
    <div style="height: 90vh"></div>
  </div>
</template>

<style scoped></style>
