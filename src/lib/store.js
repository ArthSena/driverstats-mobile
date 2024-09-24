import { createStore } from 'framework7';

const BASE_URL = "http://localhost:8080";

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
        const res = await fetch(BASE_URL + '/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if(!data.code) {
          store.dispatch('setAuth', data);
        
          store.dispatch('getRegistries');
          store.dispatch('getExpenses');
          store.dispatch('getCategories');
        }
        return data;
      } catch (err) {
        console.log('Error:', err);
      }
    },
    async register({ state }, { name, email, password, confirmPassword } ) {
      try {
        const res = await fetch(BASE_URL + '/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, confirmPassword })
        });
        const data = await res.json();
        if(!data.code) {
          store.dispatch('setAuth', data);
        
          store.dispatch('getRegistries');
          store.dispatch('getExpenses');
          store.dispatch('getCategories');
        }
        return data;
      } catch (err) {
        console.log('Error:', err);
      }
    },
    async refresh({state}) {
      const res = await fetch(BASE_URL + '/v1/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Token '+ store.state.auth.token },
      });
      const data = await res.json();
      if(!data.code) {
        store.dispatch('setAuth', data);
      }
      return data;
    },
    async updateProfile({ state }, { name, email, newPassword, confirmPassword, currentPassword }) {
      try {
        const res = await fetch(BASE_URL + '/v1/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Token '+ store.state.auth.token },
          body: JSON.stringify({ name, email, currentPassword, newPassword, confirmPassword,  })
        })
        const data = await res.json();
        
        if(!data.code) {
          state.auth.user = data;
        }

        return data;
      } catch (error) {
        console.log('Error:', err);
      }
    },


    // EXPENSE
    getExpenses({ state }) {
      fetch(BASE_URL + '/v1/expense/all', { headers: {'Authorization': 'Token ' + store.state.auth.token }})
      .then((res) => res.json())
      .then((data) => {
        state.expenses = data.list;
      })
    },
    async getExpensesOffset({ state }, { page, limit }) {
      try {
        const res = await fetch(BASE_URL + '/v1/expense/all?' + new URLSearchParams({ page, limit }), { headers: {'Authorization': 'Token ' + store.state.auth.token }})
        const data = await res.json();
        return data.list;
      } catch (err) {
        console.log('Error:', err);
      }
    },
    async createExpense({ state }, { description, amount, categoryId } ) {
      try {
        const res = await fetch(BASE_URL + '/v1/expense', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Token '+ store.state.auth.token },
          body: JSON.stringify({ description, amount, categoryId })
        })
        store.dispatch('refresh');
        store.dispatch('getExpenses');
        const data = await res.json();
        return data;
      } catch (error) {
        console.log('Error:', err);
      }
    },
    async deleteExpense({ state }, id) {
      try {
        await fetch(BASE_URL + `/v1/expense/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': 'Token ' + store.state.auth.token }
        })
        store.dispatch('getExpenses');
      } catch (error) {
        console.log('Error:', err);
      }
    },
    async updateExpense({ state }, { id, description, amount, categoryId }) {
      try {
        await fetch(BASE_URL + `/v1/expense/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Token '+ store.state.auth.token },
          body: JSON.stringify({ description, amount, categoryId })
        })
        store.dispatch('refresh');
        store.dispatch('getExpenses');
      } catch (error) {
        console.log('Error:', err);
      }
    },


    // CATEGORY
    getCategories({ state }) {
      fetch(BASE_URL + '/v1/category/all', { headers: {'Authorization': 'Token ' + store.state.auth.token }})
      .then((res) => res.json())
      .then((data) => {
        state.categories = data.list;
      })
    },
    async createCategory({ state }, { name, color } ) {
      try {
        const res = await fetch(BASE_URL + '/v1/category', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Token '+ store.state.auth.token },
          body: JSON.stringify({ name, color })
        })
        store.dispatch('refresh');
        store.dispatch('getCategories');
        const data = await res.json();
        return data;
      } catch (error) {
        console.log('Error:', err);
      }
    },
    async updateCategory({ state }, { id, name }) {
      try {
        await fetch(BASE_URL + `/v1/category/${id}`, {
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
        await fetch(BASE_URL + `/v1/category/${id}`, {
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
      fetch(BASE_URL + '/v1/registry/all', { headers: {'Authorization': 'Token ' + store.state.auth.token }})
      .then((res) => res.json())
      .then((data) => {
        state.registries = data.list;
      })
    },
    async getRegistriesOffset({ state }, { page, limit }) {
      try {
        const res = await fetch(BASE_URL + '/v1/registry/all?' + new URLSearchParams({ page, limit }), { headers: {'Authorization': 'Token ' + store.state.auth.token }})
        const data = await res.json();
        return data.list;
      } catch (err) {
        console.log('Error:', err);
      }
    },
    async createRegistry({ state }, {initialMileage}) {
      try {
        const res = await fetch(BASE_URL + '/v1/registry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Token '+ store.state.auth.token },
          body: JSON.stringify({ initialMileage })
        })
        store.dispatch('refresh');
        store.dispatch('getRegistries');
        const data = await res.json();
        return data;
      } catch (err) {
        console.log('Error:', err);
      }
    },
    async reopenRegistry({ state }, {id}) {
      try {
        await fetch(BASE_URL + `/v1/registry/${id}/reopen`, {
          method: 'POST',
          headers: { 'Authorization': 'Token '+ store.state.auth.token }
        })
        store.dispatch('refresh');
        store.dispatch('getRegistries');
      } catch (error) {
        console.log('Error:', err);
      }
    },
    async closeRegistry({ state }, {id, billed, finalMileage, trips}) {
      try {
        await fetch(BASE_URL + `/v1/registry/${id}/close`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Token '+ store.state.auth.token },
          body: JSON.stringify({ billed, finalMileage, trips })
        })
        store.dispatch('refresh');
        store.dispatch('getRegistries');
      } catch (error) {
        console.log('Error:', err);
      }
    },
    async updateRegistry({ state }, {id, billed, initialMileage, finalMileage, trips}) {
      try {
        await fetch(BASE_URL + `/v1/registry/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Token '+ store.state.auth.token },
          body: JSON.stringify({ billed, initialMileage, finalMileage, trips })
        })
        store.dispatch('refresh');
        store.dispatch('getRegistries');
      } catch (error) {
        console.log('Error:', err);
      }
    },
    async deleteRegistry({ state }, id) {
      try {
        await fetch(BASE_URL + `/v1/registry/${id}`, {
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