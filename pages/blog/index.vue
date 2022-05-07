<template>
  <div class="mx-auto p-0" style="">
    <site-header />
    <main class="py-4 mx-auto" style="max-width: 65ch">
      <div class="flex flex-col">
        <blog-card
          v-for="(doc, index) in posts"
          :key="doc.path"
          :index="index"
          :numPosts="posts.length"
          :doc="doc"
        />
      </div>
    </main>
  </div>
</template>

<script>
import BlogCard from "~/components/blog/BlogCard.vue";
import SiteHeader from "~/components/SiteHeader.vue";

export default {
  components: { BlogCard, SiteHeader },
  head() {
    return {
      title: "Cascade.page Blog",
      meta: [
        {
          name: "og:url",
          content: "https://cascade.page/blog",
        },
        {
          name: "og:title",
          content: "cascade.page blog",
        },
        {
          name: "og:description",
          content: "cascade.page blog",
        },
      ],
    };
  },
  async asyncData(context) {
    const posts = await context.$content("blog").sortBy("slug", "desc").fetch();
    const breadCrumbs = [
      {
        name: "blog",
        link: "/blog",
      },
    ];
    const getReadableDateFromSlug = (slug) => {
      const date = new Date(slug.substring(0, 10));
      var strArray = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      var d = date.getDate();
      var m = strArray[date.getMonth()];
      return `${m} ${d}, ${date.getFullYear()}`;
    };
    return {
      posts: posts.map((p) => {
        p.date = getReadableDateFromSlug(p.slug);
        return p;
      }),
      breadCrumbs,
    };
  },
};
</script>

<style>
</style>