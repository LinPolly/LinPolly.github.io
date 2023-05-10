<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: "zh-Hant-TW",
  },
  titleTemplate: (name) => {
    return name ? `${name} - ` : "R";
  },
});
</script>

<template>
  <v-app>
    <sidebar></sidebar>
    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
interface Breadcrumb {
  to: string;
  title: string;
}

export default {
  computed: {
    getBreadcrumbs(): Breadcrumb[] {
      const route = useRoute();

      const pathArray = route.path.split("/");
      pathArray.shift();
      const breadcrumbs = pathArray.reduce((breadcrumbArray, path, idx) => {
        //@ts-ignore
        breadcrumbArray.push({
          to: !!breadcrumbArray[idx - 1]
            ? //@ts-ignore
              breadcrumbArray[idx - 1].to + "/" + path
            : "/" + path,
          title: decodeURIComponent(path.toString().replace("-", " ")),
        });
        return breadcrumbArray;
      }, []);
      return breadcrumbs;
    },
  },
  mounted() {},
  beforeMount() {},
};
</script>