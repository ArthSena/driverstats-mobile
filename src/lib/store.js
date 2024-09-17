import { createStore } from 'framework7';

const store = createStore({
  state: {
    auth: [],
    registries: [],
    expenses: [],
    categories: []
  },

  getters: {
    auth({ state }) {
      return state.auth;
    },
    registries({ state }) {
      return state.registries;
    },
    expenses({ state }) {
      return state.expenses;
    },
    categories({ state }) {
      return state.categories;
    },
  },

  actions: {
    setAuth({ state }, auth) {
      state.auth = auth;
    },

    async login({ state }, { email, password} ) {
      try {
        const res = await fetch('http://localhost:8080/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        store.dispatch('setAuth', data);
        
        store.dispatch('getRegistries');
        store.dispatch('getExpenses');
        store.dispatch('getCategories');
      } catch (err) {
        console.log('Error:', err);
      }
    },


    getExpenses({ state }) {
      fetch('http://localhost:8080/v1/expense/all', { headers: {'Authorization': 'Token ' + store.state.auth.token }})
      .then((res) => res.json())
      .then((data) => {
        state.expenses = data.list;
      })
    },

    // CATEGORY
    getCategories({ state }) {
      fetch('http://localhost:8080/v1/category/all', { headers: {'Authorization': 'Token ' + store.state.auth.token }})
      .then((res) => res.json())
      .then((data) => {
        state.categories = data.list;
      })
    },
    async createCategory({ state }, name ) {
      try {
        const res = await fetch(`http://localhost:8080/v1/category`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Token '+ store.state.auth.token },
          body: JSON.stringify({ name })
        })
        store.dispatch('getCategories');
        const data = await res.json();
        return data;
      } catch (error) {
        console.log('Error:', err);
      }
    },
    async updateCategory({ state }, { id, name }) {
      try {
        await fetch(`http://localhost:8080/v1/category/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Token '+ store.state.auth.token },
          body: JSON.stringify({ name })
        })
        store.dispatch('getCategories');
      } catch (error) {
        console.log('Error:', err);
      }
    },
    async deleteCategory({ state }, id) {
      try {
        await fetch(`http://localhost:8080/v1/category/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': 'Token ' + store.state.auth.token }
        })
        store.dispatch('getCategories');
      } catch (error) {
        console.log('Error:', err);
      }
    },

    // REGISTRY //
    getRegistries({ state }) {
      fetch('http://localhost:8080/v1/registry/all', { headers: {'Authorization': 'Token ' + store.state.auth.token }})
      .then((res) => res.json())
      .then((data) => {
        state.registries = data.list;
      })
    },
    async createRegistry({ state }, {initialMileage}) {
      try {
        const res = await fetch(`http://localhost:8080/v1/registry`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Token '+ store.state.auth.token },
          body: JSON.stringify({ initialMileage })
        })
        store.dispatch('getRegistries');
        const data = await res.json();
        return data;
      } catch (error) {
        console.log('Error:', err);
      }
    },
    async reopenRegistry({ state }, {id}) {
      try {
        await fetch(`http://localhost:8080/v1/registry/${id}/reopen`, {
          method: 'POST',
          headers: { 'Authorization': 'Token '+ store.state.auth.token }
        })
        store.dispatch('getRegistries');
      } catch (error) {
        console.log('Error:', err);
      }
    },
    async closeRegistry({ state }, {id, billed, finalMileage, trips}) {
      try {
        await fetch(`http://localhost:8080/v1/registry/${id}/close`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Token '+ store.state.auth.token },
          body: JSON.stringify({ billed, finalMileage, trips })
        })
        store.dispatch('getRegistries');
      } catch (error) {
        console.log('Error:', err);
      }
    },
    async updateRegistry({ state }, {id, billed, initialMileage, finalMileage, trips}) {
      try {
        await fetch(`http://localhost:8080/v1/registry/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Token '+ store.state.auth.token },
          body: JSON.stringify({ billed, initialMileage, finalMileage, trips })
        })
        store.dispatch('getRegistries');
      } catch (error) {
        console.log('Error:', err);
      }
    },
    async deleteRegistry({ state }, id) {
      try {
        await fetch(`http://localhost:8080/v1/registry/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': 'Token ' + store.state.auth.token }
        })

        store.dispatch('getRegistries');
      } catch (error) {
        console.log('Error:', err);
      }
    }


  }
});

export default store;