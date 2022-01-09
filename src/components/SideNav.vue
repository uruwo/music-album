<template>
  <v-navigation-drawer v-model="$store.state.drawer" fixed temporary right>
    <v-list nav>
      <v-list-item-group>
        <v-list-item to="/home">
          <v-list-item-title>アルバム</v-list-item-title>
        </v-list-item>
        <v-list-item to="/profile">
          <v-list-item-title>マイページ</v-list-item-title>
        </v-list-item>
        <v-list-item to="/comments">
          <v-list-item-title>みんなの感想</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>