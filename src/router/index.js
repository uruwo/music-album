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
    path: '/profile',
    name: 'Profile',
    component: Profile,
    children: [
      {
        path: 'comment',
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
        path: 'comment/:user_id?',
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
