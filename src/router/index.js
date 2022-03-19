import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import Comments from '../views/Comments.vue'
import OtherProfile from '../views/OtherProfile.vue'
import Loading from '../views/Loading.vue'
import OthersComment from '../views/OthersComment.vue'
import Follower from '../views/Follower.vue'
import Followee from '../views/Followee.vue'
import MyComment from '../views/MyComment.vue'
import FavoriteComment from '../views/FavoriteComment.vue'
import Top from '../views/Top.vue'
import Artists from '../views/Artists.vue'
import Titles from '../views/Titles.vue'
import Albums from '../views/Albums.vue'
import Album from '../views/Album.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Top',
    component: Top
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/loading',
    name: 'Loading',
    component: Loading
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/albums',
    name: 'Albums',
    component: Albums
  },
  {
    path: '/album/:album_id?',
    name: 'Album',
    component: Album
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    children: [
      {
        path: 'comment/:keyword?',
        name: 'MyComment',
        component: MyComment
      },
      {
        path: 'favorite_comment',
        name: 'MyFavoriteComment',
        component: FavoriteComment
      },
      {
        path: 'follower',
        name: 'MyFollower',
        component: Follower
      },
      {
        path: 'followee',
        name: 'MyFollowee',
        component: Followee
      },
      {
        path: 'artists',
        name: 'MyArtists',
        component: Artists
      },
      {
        path: 'titles',
        name: 'MyTitles',
        component: Titles
      }
    ]
  },
  {
    path: '/comments',
    name: 'Comments',
    component: Comments
  },
  {
    path: '/other_profile',
    name: 'OtherProfile',
    component: OtherProfile,
    children: [
      {
        path: 'comment/:user_id?/:keyword?',
        name: 'OthersComment',
        component: OthersComment
      },
      {
        path: 'favorite_comment/:user_id?',
        name: 'OthersFavoriteComment',
        component: FavoriteComment
      },
      {
        path: 'follower/:user_id?',
        name: 'OthersFollower',
        component: Follower
      },
      {
        path: 'followee/:user_id?',
        name: 'OthersFollowee',
        component: Followee
      },
      {
        path: 'artists/:user_id?',
        name: 'OthersArtists',
        component: Artists
      },
      {
        path: 'titles/:user_id?',
        name: 'OthersTitles',
        component: Titles
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
