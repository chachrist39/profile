import Vue from 'vue'
import Vuex from 'vuex'
// import {auth} from '@/firebase'
// import * as firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    custom: {status: 'user'},
    user: null,
    guest: null,
    status: '',
  },
  mutations: {
    setUser(state){
      state.status = 'user'
    },
    setGuest(state, payload){
      state.guest = payload
    },
    clearUser(state){
      state.guest = 'guest'
    },
    clearRole(state){
      state.status = null
    },
  },
  actions: {

  },
  getters:{
    user(state){
      return state.user
    },
    guest(state){
      return state.guest
    },
  }
})