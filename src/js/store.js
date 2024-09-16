import { createStore } from 'framework7';
import { v4 as uuidv4 } from 'uuid';

const store = createStore({
  state: {

    auth: {
      token: "",
      user: {
        id: uuidv4(),
        name: "Arthur",
        email: "arthsena.m@gmail.com"        
      }
    },

    registries: [],
    expenses: [],
    categories: []
  },
  getters: {
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
    async login({ commit }, { email, password }) {
      const response = await callApi("auth/login", "POST", { email, password });

      if(response.ok) commit("setUser", response.json().auth);
    },
    setUser({ state }, user) {
      state.user = user;
    },

    async addRegistry({ state }, registry) {
      const response = await callApi("registry", "POST", { registry });

      if(response.ok) state.registries = [...state.registries, response.json().registries.list];
      else console.error("Failed to add registry");
    },
    async addExpense({ state }, expense) {
      const response = await callApi("expense", "POST", { expense });

      if(response.ok) state.expenses = [...state.expenses, response.json().expenses.list];
      else console.error("Failed to add expense");
    },
    async addCategory({ state }, name) {
      const response = await callApi("categories", "POST", { name });

      if(response.ok) state.categories = [...state.categories, response.json().categories.list];
      else console.error("Failed to add category");
    },

    async removeRegistry({ state }, registryId) {
      const response = await callApi("registry", "DELETE", { id: registryId });

      if(response.status == 201) state.registries = state.registries.filter((registry) => registry.id!== registryId);
      else console.error("Failed to remove registry");
    },
    async removeExpense({ state }, expenseId) {
      const response = await callApi("expense", "DELETE", { id: expenseId });

      if(response.status == 201)  state.expenses = state.expenses.filter((expense) => expense.id!== expenseId);
      else console.error("Failed to remove expense");
    },
    async removeCategory({ state }, name) {
      const response = await callApi("category", "DELETE", { name });

      if(response.status == 201) state.categories = state.categories.filter((category) => category.name!== name);
      else console.error("Failed to remove category");
    },

    async fetchRegistries({ state }) {
      const response = await callApi("registry/all");
      return response != null ? response.json().registries : state.registries;
    },
    async fetchExpenses({ state }) {
      const response = await callApi("expense/all");
      return response != null ? response.json().expenses : state.expenses;
    },
    async fetchCategories({ state }) {
      const response = await callApi("category/all");
      return response != null ? response.json().categories : state.categories;
    },
  },
});

async function callApi(path, method = 'GET', body = null) {
  try {
    return await fetch("http://localhost:8080/v1/" + path, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer Token ' + store.user.token,
      },
      method,
      body: body? JSON.stringify(body) : null,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

store.dispatch('fetchCategories');
store.dispatch('fetchExpenses');
store.dispatch('fetchRegistries');

export default store;