<script setup lang="ts">
import { toDateRangeIso, type DateRange } from "@markwhen/parser/lib/Types";
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { computed, ref } from "vue";
import { DateTime } from "luxon";
import { useAppSettingsStore } from "@/AppSettings/appSettingsStore";
import { dateRangeToString } from "@/Markwhen/utilities/dateRangeToString2";

const props = defineProps<{ modelValue: DateRange }>();

const emit = defineEmits<{
  (event: "isOpen", open: boolean): void;
  (event: "update:modelValue", dateRange: DateRange): void;
}>();

const rangeValue = computed({
  get: () => {
    const { fromDateTimeIso, toDateTimeIso } = toDateRangeIso(props.modelValue);
    return [fromDateTimeIso, toDateTimeIso];
  },
  set: (v) => {
    if (Array.isArray(v)) {
      const asDates = v as unknown as [Date, Date];
      emit("update:modelValue", dateOrDateArrayToDateRange(asDates));
    } else {
      // Is singular date
      const asDate = v as unknown as Date;
      emit("update:modelValue", dateOrDateArrayToDateRange([asDate, asDate]));
    }
  },
});

const dateOrDateArrayToDateRange = (range: Date | [Date] | [Date, Date]) => {
  let array: Date[];
  if (Array.isArray(range)) {
    if (range.length === 2) {
      array = range;
    } else {
      array = [range[0], range[0]];
    }
  } else {
    array = [range, range];
  }
  return {
    fromDateTime: DateTime.fromJSDate(array[0]),
    toDateTime: DateTime.fromJSDate(array[1]),
  };
};

const previewFormat = (dateOrRange: Date | [Date, Date]) => {
  const dateRange = dateOrDateArrayToDateRange(
    Array.isArray(dateOrRange) ? dateOrRange : [dateOrRange, dateOrRange]
  );
  const s = dateRangeToString(dateRange);
  return s;
};

const appSettingsStore = useAppSettingsStore();
const dp = ref<typeof DatePicker>();
const p = (b: HTMLElement | undefined) => {
  return {
    top: "1px",
    left: `${b!.clientWidth / 2}px`,
    transform: "translateX(-50%)",
  };
};

const dark = computed(() => appSettingsStore.inferredDarkMode);

const select = () => {
  dp.value?.selectDate();
};
</script>

<template>
  <DatePicker
    ref="dp"
    v-model="rangeValue"
    class="rangePicker mb-1"
    teleport="#rangePickerPlacement"
    :alt-position="p"
    :dark="dark"
    model-auto
    partial-range
    week-start="0"
    :clearable="false"
    range
    :format="previewFormat"
    @open="$emit('isOpen', true)"
    @closed="$emit('isOpen', false)"
    ><template #action-select>
      <button
        class="ml-auto rounded px-2 dark:bg-indigo-200 bg-indigo-100 text-indigo-800 font-bold flex flex-row items-center justify-center"
        role="submit"
        @click="select"
      >
        Select
      </button></template
    ></DatePicker
  >
  <div class="relative" id="rangePickerPlacement"></div>
</template>

<style>
#rangePickerPlacement .dp__theme_dark {
  --dp-background-color: var(--color-gray-900);
  --dp-border-color: transparent;
  --dp-menu-border-color: transparent;
  --dp-hover-color: var(--color-gray-700);
}

.dp__theme_dark {
  --dp-background-color: var(--color-gray-700);
  --dp-border-color: transparent;
  --dp-border-color-hover: transparent;
  --dp-menu-border-color: transparent;
  --dp-hover-color: var(--color-gray-700);
  --dp-success-color: var(--color-indigo-200);
  --dp-primary-color: var(--color-indigo-600);
  --dp-icon-color: var(--color-gray-400);
}
.dp__theme_light {
  --dp-border-color: transparent;
  --dp-border-color-hover: transparent;
  --dp-icon-color: var(--color-gray-400);
  --dp-background-color: var(--color-gray-100);
}

.dp__menu {
  --dp-menu-border-color: transparent;
  font-family: inherit;
  @apply shadow rounded;
}

.dp__input {
  @apply font-bold font-mono text-sm;
}

.dp__month_year_wrap {
  @apply font-bold;
}
</style>
