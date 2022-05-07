<template>
  <div>
    <site-header />
    <div class="prose mx-auto">
      <a href="/blog" class="">&lt; back</a>
    </div>
    <div class="mx-auto my-8" style="max-width: 800px">
      <div class="titleArea">
        <div class="text-center mb-3 flex flex-col items-center justify-center">
          <h3 class="font-bold text-2xl">{{ post.title }}</h3>
          <span class="text-md text-gray-600">{{ post.date }}</span>
        </div>
      </div>
      <div class="prose mx-auto">
        <nuxt-content :document="post" class="mb-5 px-2 contents" />
      </div>
      <div class="h-6"></div>
    </div>
  </div>
</template>

<script>
import VImg from "~/components/blog/VImg.vue";
import SiteHeader from "~/components/SiteHeader.vue";

export default {
  components: { VImg, SiteHeader },
  head() {
    let image;
    if (this.post.image) {
      if (this.post.image.startsWith("http")) {
        image = this.post.image;
      } else {
        image = `https://cascade.page${this.post.image}`;
      }
    }
    let metas = [
      {
        name: "og:image",
        prefix: "og: http://ogp.me/ns#",
        content: image,
      },
      {
        name: "author",
        content: "Rob Koch",
      },
      {
        name: "image",
        property: "og:image",
        content: image,
      },
      {
        property: "og:title",
        content: this.post.title + " - cascade.page blog",
      },
      {
        property: "og:type",
        content: "article",
      },
      {
        property: "twitter:card",
        content: "summary",
      },
      {
        name: "qr:innerText",
        content: this.post.title,
      },
      {
        property: "twitter:title",
        content: this.post.title,
      },
      {
        property: "twitter:image",
        content: image,
      },
    ];
    if (this.post.description) {
      metas.push({
        name: "description",
        property: "og:description",
        content: this.post.description,
      });
      metas.push({
        property: "twitter:description",
        content: this.post.description,
      });
    }
    return {
      title: this.post.title + " - cascade.page blog",
      meta: metas,
    };
  },
  async asyncData({ $content, params }) {
    const post = await $content("blog", params.slug).fetch();
    const breadcrumbs = [
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
    post.date = getReadableDateFromSlug(post.slug);
    return { post, breadcrumbs };
  },
};
</script>

<style>
/* blockquote {
  padding-left: 1rem;
  padding-right: 1rem;
  border-left: 1px solid gray;
  font-style: italic;
  color: gray;
}
.executiveSummary {
  background-color: rgb(153 50 204 / 10%);
}
.nuxt-content p {
  font-weight: 300;
}
.titleArea {
  margin-top: 6rem;
  margin-bottom: 6rem;
}

.nuxt-content table {
  font-size: 90%;
  font-weight: 300;
  /* display: block; 
  width: 100%;
  overflow-x: auto;
}
.nuxt-content td {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-right: 1rem;
}
.nuxt-content th {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-right: 1rem;
}
.nuxt-content tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
.nuxt-content table td,
.nuxt-content table th {
  padding: 0.75rem;
  text-align: center;
}
.nuxt-content table ol {
  padding-left: 20px;
}
.nuxt-content table ol li {
  padding-left: 4px;
  margin-bottom: 0.5rem;
} */
</style>