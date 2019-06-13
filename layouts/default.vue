<template>
  <v-app>
    <v-toolbar
      :clipped-left="clipped"
      fixed
      app
      dark
    >
      <v-toolbar-title v-text="title" />
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'HUser CRUD'
    }
  }
}
</script>
