import Vue from 'vue';
import Vuex from 'vuex';
import * as firebase from 'firebase';

const config = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
};
firebase.initializeApp(config);
const db = firebase.firestore();
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    isLogin: false,
    returnStatus: null,
    returnError: null,
  },
  mutations: {
    loginUser(state, payload) {
      state.user = payload;
      state.isLogin = true;
    },
    logoutUser(state) {
      state.user = null;
      state.isLogin = false;
    },
    setStatus(state, payload) {
      state.returnStatus = payload;
    },
    setError(state, payload) {
      state.returnError = payload;
    },
  },
  actions: {
    initFirebaseWatch({ commit }) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          commit('setStatus', 'loading');
          db.collection('Accounts').doc(user.email!).get().then((doc: any) => {
            commit('loginUser', doc.data());
            commit('setStatus', 'success');
            commit('setError', null);
          })
            .catch((error: any) => {
              commit('setStatus', 'errorAccounts');
              commit('setError', error);
            });
        }
      });
    },
    loginAction({ commit }, payload) {
      commit('setStatus', 'loading');
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then((response) => {
          commit('loginUser', response.user!);
          commit('setStatus', 'success');
          commit('setError', null);
        })
        .catch((error) => {
          commit('setStatus', 'failed');
          commit('setError', error);
        });
    },
    signOutAction({ commit }) {
      commit('setStatus', 'loading');
      firebase.auth().signOut()
        .then(() => {
          commit('logoutUser');
          commit('setStatus', 'success');
          commit('setError', null);
        })
        .catch((error) => {
          commit('setStatus', 'failure');
          commit('setError', error.message);
        });
    },
    timeInAction({ commit }, payload) {
      commit('setStatus', 'loading');
    },
    timeOutAction({ commit }, payload) {
      commit('setStatus', 'loading');
    },
    creatAccountAction({ commit }, payload) {
      commit('setStatus', 'loading');
    },
    editAccountAction({ commit }, payload) {
      commit('setStatus', 'loading');
    },
    addApproverAction({ commit }, payload) {
      commit('setStatus', 'loading');
    },
    removeApproverAction({ commit }, payload) {
      commit('setStatus', 'loading');
    },
    changePasswordAction({ commit }, payload) {
      commit('setStatus', 'loading');
    },
    createLeaveAction({ commit }, payload) {
      commit('setStatus', 'loading');
    },
    editLeaveAction({ commit }, payload) {
      commit('setStatus', 'loading');
    },
    // Get Actions
    getAccountInformation({ commit }) {
      commit('setStatus', 'loading');
    },
    getTimeIn({ commit }) {
      commit('setStatus', 'loading');
    },
    getTimeOut({ commit }) {
      commit('setStatus', 'loading');
    },
    // Check
    getPing({ commit }) {
      db.collection('check').get().then((docs) => {
        commit('setStatus', 'success');
        console.log('Connection: True');
        
        console.log(docs);
      }).catch((error) => {
        commit('setStatus', 'errorGetGroup');
        commit('setError', error);
        console.log(error);
      });
    },
  },
});
