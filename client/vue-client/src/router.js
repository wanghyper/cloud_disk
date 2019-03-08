import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import(
        /* webpackChunkName: "home" */
        './views/Home.vue'
        )
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(
        /* webpackChunkName: "login" */
        './views/Login.vue'
        )
    },
    {
      path: '/phone',
      name: 'phone',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(
        /* webpackChunkName: "phone" */
        './views/Phone.vue'
        )
    },
    {
      path: '/player',
      name: 'player',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(
        /* webpackChunkName: "player" */
        './views/Player.vue'
        )
    }
  ]
})
