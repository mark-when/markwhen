<script setup lang="ts"></script>

<template>
  <section class="rounded p-2 dark:bg-slate-800 bg-slate-200 relative shadow">
    <button
      class="absolute right-0 top-0 p-2 dark:bg-slate-800 bg-slate-200 rounded"
      @click="$emit('close')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </button>
    <h3 class="font-medium">
      Markwhen is a text-to-timeline tool. Write plain text in markdown and have
      it rendered in a nice-looking timeline, map, calendar, or other view.
    </h3>
    <h3 class="font-medium pt-2">
      Your data is stored locally on your device until you decide to share.
    </h3>
    <h3 class="font-medium pt-2">Select a view to get started!</h3>
    <div class="flex pt-2 gap-2 overflow-scroll">
      <a
        href="https://github.com/mark-when/markwhen"
        class="underline font-medium flex flex-row items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded flex-shrink-0"
        target="_blank"
        ><svg
          viewBox="0 0 16 16"
          width="16"
          height="16"
          class="w-4 h-4"
          aria-hidden="true"
          fill="currentColor"
          data-v-7e058ede=""
        >
          <path
            d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"
            data-v-7e058ede=""
          ></path></svg
        >Github<svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          stroke-width="3"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          data-v-7e058ede=""
        >
          <path
            stroke="none"
            d="M0 0h24v24H0z"
            fill="none"
            data-v-7e058ede=""
          ></path>
          <path d="M5 12l14 0" data-v-7e058ede=""></path>
          <path d="M13 18l6 -6" data-v-7e058ede=""></path>
          <path d="M13 6l6 6" data-v-7e058ede=""></path></svg
      ></a>
      <a
        href="https://marketplace.visualstudio.com/items?itemName=Markwhen.markwhen"
        class="underline font-medium flex flex-row items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded flex-shrink-0"
        target="_blank"
        ><svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
        >
          <mask
            id="mask0"
            mask-type="alpha"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="100"
            height="100"
            data-v-7e058ede=""
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M70.9119 99.3171C72.4869 99.9307 74.2828 99.8914 75.8725 99.1264L96.4608 89.2197C98.6242 88.1787 100 85.9892 100 83.5872V16.4133C100 14.0113 98.6243 11.8218 96.4609 10.7808L75.8725 0.873756C73.7862 -0.130129 71.3446 0.11576 69.5135 1.44695C69.252 1.63711 69.0028 1.84943 68.769 2.08341L29.3551 38.0415L12.1872 25.0096C10.589 23.7965 8.35363 23.8959 6.86933 25.2461L1.36303 30.2549C-0.452552 31.9064 -0.454633 34.7627 1.35853 36.417L16.2471 50.0001L1.35853 63.5832C-0.454633 65.2374 -0.452552 68.0938 1.36303 69.7453L6.86933 74.7541C8.35363 76.1043 10.589 76.2037 12.1872 74.9905L29.3551 61.9587L68.769 97.9167C69.3925 98.5406 70.1246 99.0104 70.9119 99.3171ZM75.0152 27.2989L45.1091 50.0001L75.0152 72.7012V27.2989Z"
              fill="white"
              data-v-7e058ede=""
            ></path>
          </mask>
          <g mask="url(#mask0)" data-v-7e058ede="">
            <path
              d="M96.4614 10.7962L75.8569 0.875542C73.4719 -0.272773 70.6217 0.211611 68.75 2.08333L1.29858 63.5832C-0.515693 65.2373 -0.513607 68.0937 1.30308 69.7452L6.81272 74.754C8.29793 76.1042 10.5347 76.2036 12.1338 74.9905L93.3609 13.3699C96.086 11.3026 100 13.2462 100 16.6667V16.4275C100 14.0265 98.6246 11.8378 96.4614 10.7962Z"
              fill="#0065A9"
              data-v-7e058ede=""
            ></path>
            <g filter="url(#filter0_d)" data-v-7e058ede="">
              <path
                d="M96.4614 89.2038L75.8569 99.1245C73.4719 100.273 70.6217 99.7884 68.75 97.9167L1.29858 36.4169C-0.515693 34.7627 -0.513607 31.9063 1.30308 30.2548L6.81272 25.246C8.29793 23.8958 10.5347 23.7964 12.1338 25.0095L93.3609 86.6301C96.086 88.6974 100 86.7538 100 83.3334V83.5726C100 85.9735 98.6246 88.1622 96.4614 89.2038Z"
                fill="#007ACC"
                data-v-7e058ede=""
              ></path>
            </g>
            <g filter="url(#filter1_d)" data-v-7e058ede="">
              <path
                d="M75.8578 99.1263C73.4721 100.274 70.6219 99.7885 68.75 97.9166C71.0564 100.223 75 98.5895 75 95.3278V4.67213C75 1.41039 71.0564 -0.223106 68.75 2.08329C70.6219 0.211402 73.4721 -0.273666 75.8578 0.873633L96.4587 10.7807C98.6234 11.8217 100 14.0112 100 16.4132V83.5871C100 85.9891 98.6234 88.1786 96.4586 89.2196L75.8578 99.1263Z"
                fill="#1F9CF0"
                data-v-7e058ede=""
              ></path>
            </g>
            <g
              opacity="0.25"
              data-v-7e058ede=""
              style="mix-blend-mode: overlay"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M70.8511 99.3171C72.4261 99.9306 74.2221 99.8913 75.8117 99.1264L96.4 89.2197C98.5634 88.1787 99.9392 85.9892 99.9392 83.5871V16.4133C99.9392 14.0112 98.5635 11.8217 96.4001 10.7807L75.8117 0.873695C73.7255 -0.13019 71.2838 0.115699 69.4527 1.44688C69.1912 1.63705 68.942 1.84937 68.7082 2.08335L29.2943 38.0414L12.1264 25.0096C10.5283 23.7964 8.29285 23.8959 6.80855 25.246L1.30225 30.2548C-0.513334 31.9064 -0.515415 34.7627 1.29775 36.4169L16.1863 50L1.29775 63.5832C-0.515415 65.2374 -0.513334 68.0937 1.30225 69.7452L6.80855 74.754C8.29285 76.1042 10.5283 76.2036 12.1264 74.9905L29.2943 61.9586L68.7082 97.9167C69.3317 98.5405 70.0638 99.0104 70.8511 99.3171ZM74.9544 27.2989L45.0483 50L74.9544 72.7012V27.2989Z"
                fill="url(#paint0_linear)"
                data-v-7e058ede=""
              ></path>
            </g>
          </g>
          <defs data-v-7e058ede="">
            <filter
              id="filter0_d"
              x="-8.39411"
              y="15.8291"
              width="116.727"
              height="92.2456"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
              data-v-7e058ede=""
            >
              <feFlood
                flood-opacity="0"
                result="BackgroundImageFix"
                data-v-7e058ede=""
              ></feFlood>
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                data-v-7e058ede=""
              ></feColorMatrix>
              <feOffset data-v-7e058ede=""></feOffset>
              <feGaussianBlur
                stdDeviation="4.16667"
                data-v-7e058ede=""
              ></feGaussianBlur>
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                data-v-7e058ede=""
              ></feColorMatrix>
              <feBlend
                mode="overlay"
                in2="BackgroundImageFix"
                result="effect1_dropShadow"
                data-v-7e058ede=""
              ></feBlend>
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow"
                result="shape"
                data-v-7e058ede=""
              ></feBlend>
            </filter>
            <filter
              id="filter1_d"
              x="60.4167"
              y="-8.07558"
              width="47.9167"
              height="116.151"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
              data-v-7e058ede=""
            >
              <feFlood
                flood-opacity="0"
                result="BackgroundImageFix"
                data-v-7e058ede=""
              ></feFlood>
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                data-v-7e058ede=""
              ></feColorMatrix>
              <feOffset data-v-7e058ede=""></feOffset>
              <feGaussianBlur
                stdDeviation="4.16667"
                data-v-7e058ede=""
              ></feGaussianBlur>
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                data-v-7e058ede=""
              ></feColorMatrix>
              <feBlend
                mode="overlay"
                in2="BackgroundImageFix"
                result="effect1_dropShadow"
                data-v-7e058ede=""
              ></feBlend>
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow"
                result="shape"
                data-v-7e058ede=""
              ></feBlend>
            </filter>
            <linearGradient
              id="paint0_linear"
              x1="49.9392"
              y1="0.257812"
              x2="49.9392"
              y2="99.7423"
              gradientUnits="userSpaceOnUse"
              data-v-7e058ede=""
            >
              <stop stop-color="white" data-v-7e058ede=""></stop>
              <stop
                offset="1"
                stop-color="white"
                stop-opacity="0"
                data-v-7e058ede=""
              ></stop>
            </linearGradient>
          </defs></svg
        >VS Code Extension<svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          stroke-width="3"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          data-v-7e058ede=""
        >
          <path
            stroke="none"
            d="M0 0h24v24H0z"
            fill="none"
            data-v-7e058ede=""
          ></path>
          <path d="M5 12l14 0" data-v-7e058ede=""></path>
          <path d="M13 18l6 -6" data-v-7e058ede=""></path>
          <path d="M13 6l6 6" data-v-7e058ede=""></path></svg
      ></a>
      <a
        href="https://discord.gg/3rTpUD94ac"
        class="underline font-medium flex flex-row items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded flex-shrink-0"
        target="_blank"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
          <path d="M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
          <path d="M7.5 7.5c3.5 -1 5.5 -1 9 0"></path>
          <path d="M7 16.5c3.5 1 6.5 1 10 0"></path>
          <path
            d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-1 2.5"
          ></path>
          <path
            d="M8.5 17c0 1 -1.356 3 -1.832 3c-1.429 0 -2.698 -1.667 -3.333 -3c-.635 -1.667 -.476 -5.833 1.428 -11.5c1.388 -1.015 2.782 -1.34 4.237 -1.5l1 2.5"
          ></path></svg
        >Discord<svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          stroke-width="3"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          data-v-7e058ede=""
        >
          <path
            stroke="none"
            d="M0 0h24v24H0z"
            fill="none"
            data-v-7e058ede=""
          ></path>
          <path d="M5 12l14 0" data-v-7e058ede=""></path>
          <path d="M13 18l6 -6" data-v-7e058ede=""></path>
          <path d="M13 6l6 6" data-v-7e058ede=""></path></svg
      ></a>
      <a
        href="https://docs.markwhen.com"
        class="underline font-medium flex flex-row items-center gap-1 px-2 py-1 bg-indigo-600 text-slate-50 rounded flex-shrink-0"
        target="_blank"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          stroke-width="3"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          data-v-7e058ede=""
        >
          <path
            stroke="none"
            d="M0 0h24v24H0z"
            fill="none"
            data-v-7e058ede=""
          ></path>
          <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" data-v-7e058ede=""></path>
          <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" data-v-7e058ede=""></path>
          <path d="M3 6l0 13" data-v-7e058ede=""></path>
          <path d="M12 6l0 13" data-v-7e058ede=""></path>
          <path d="M21 6l0 13" data-v-7e058ede=""></path></svg
        >Documentation<svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          stroke-width="3"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          data-v-7e058ede=""
        >
          <path
            stroke="none"
            d="M0 0h24v24H0z"
            fill="none"
            data-v-7e058ede=""
          ></path>
          <path d="M5 12l14 0" data-v-7e058ede=""></path>
          <path d="M13 18l6 -6" data-v-7e058ede=""></path>
          <path d="M13 6l6 6" data-v-7e058ede=""></path></svg
      ></a>
    </div>
  </section>
</template>

<style scoped></style>
