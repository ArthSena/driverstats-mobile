import { createStore } from 'framework7';
import { v4 as uuidv4 } from 'uuid';

const store = createStore({
  state: {
    registries: [],
    expenses: [],
    categories: [],
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
    async fetchData({ commit }) {
      try {
        const response = await fetch('https://api.example.com/data', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_TOKEN',
          }
        });
        const data = await response.json();

        commit('setRegistries', data.registries);
        commit('setExpenses', data.expenses);
        commit('setCategories', data.categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    setRegistries({ state }, registries) {
      state.registries = registries;
    },
    setExpenses({ state }, expenses) {
      state.expenses = expenses;
    },
    setCategories({ state }, categories) {
      state.categories = categories;
    },
    // ... (existing actions)
  },
});

// Fetch data when the store is created
store.dispatch('fetchData');

export default store;




// import { createStore } from 'framework7';
// import {v4 as uuidv4} from 'uuid';

// const store = createStore({
//   state: {
//     registries: [
//       {
//         id: 'fd524219-bf70-429e-97f2-ed3afed40c25',
//         createdAt: new Date(2024, 8, 16, 12, 19),
//         closedAt: new Date(2024, 8, 16, 17, 19),
//         status: 'OPPENED',
//         initialMileage: 152.12,
//         finalMileage: 284.19,
//         billed: 124.25,
//         trips: 12,
//       },
//       {
//         id: '6b450f6b-f1de-4b9f-84a5-d912aa5f5eca',
//         createdAt: new Date(2024, 8, 12, 12, 19),
//         closedAt: new Date(2024, 8, 12, 22, 12),
//         status: 'CLOSED',
//         initialMileage: 0,
//         finalMileage: 132.16,
//         billed: 159.25,
//         trips: 5,
//       },
//       {
//         id: '88e5ff2a-4da3-482d-9561-fbf53e495b46',
//         createdAt: new Date(2024, 8, 2, 15, 1),
//         closedAt: new Date(2024, 8, 2, 22, 19),
//         status: 'CLOSED',
//         initialMileage: 0,
//         finalMileage: 73.12,
//         billed: 189.52,
//         trips: 13,
//       },
//       {
//         id: '88e5ff2a-4da3-482d-9561-fbf53e495b46',
//         createdAt: new Date(2024, 7, 12, 10, 11),
//         closedAt: new Date(2024, 7, 12, 23, 19),
//         status: 'CLOSED',
//         initialMileage: 0,
//         finalMileage: 172.51,
//         billed: 257.25,
//         trips: 24,
//       },
//       {
//         id: '88e5ff2a-4da3-482d-9561-fbf53e495b46',
//         createdAt: new Date(2024, 7, 11, 15, 19),
//         closedAt: new Date(2024, 7, 11, 22, 19),
//         status: 'CLOSED',
//         initialMileage: 0,
//         finalMileage: 132.51,
//         billed: 124.25,
//         trips: 8,
//       },


//     ],
//     expenses: [
//       {
//         id: '88e5ff2a-4da3-482d-9561-fbf53e495b46',
//         date: new Date(2024, 8, 16, 18),
//         category: 'Business',
//         description: 'Fuel lorem ipsum dolor sit amet, consectetur t',
//         amount: 50.25,
//       },
//       {
//         id: '88e5ff2a-4da3-482d-9561-fbsf3e495b46',
//         date: new Date(2024, 8, 15, 18),
//         category: 'Food',
//         description: 'Market',
//         amount: 72.21,
//       },
//       {
//         id: '88e5ff2a-4da3-482d-9561-fbsf3e495b46',
//         date: new Date(2024, 8, 11, 18),
//         category: 'Food',
//         description: 'Market',
//         amount: 72.21,
//       },
//       {
//         id: '88e5ff2a-4da3-482d-9561-fbsf3e495b46',
//         date: new Date(2024, 7, 15, 17),
//         category: 'Food',
//         description: 'Market',
//         amount: 72.21,
//       },
//       {
//         id: '88e5ff2a-4da3-482d-9561-fbsf3e495b46',
//         date: new Date(2024, 7, 11, 12),
//         category: 'Food',
//         description: 'Market',
//         amount: 72.21,
//       }
//     ],
//     categories: [
//       {
//         id: '1',
//         name: 'Business',
//       },
//       {
//         id: '2',
//         name: 'Food',
//       },
//       {
//         id: '3',
//         name: 'Transportation',
//       },
//       {
//         id: '4',
//         name: 'Health',
//       },
//       {
//         id: '5',
//         name: 'Other',
//       },
//     ]
//   },
//   getters: {
//     registries({ state }) {
//       return state.registries;
//     },
//     expenses({ state }) {
//       return state.expenses;
//     },
//     categories({ state }) {
//       return state.categories;
//     },
//   },
//   actions: {
//     addRegistry({ state }, registry) {
//       state.registries = [...state.registries, registry];
//     },
//     addExpense({ state }, expense) {
//       state.expenses = [...state.expenses, expense];
//     },
//     addCategory({ state }, name) {
//       state.categories = [...state.categories, {
//         id: uuidv4(),
//         name
//       }];
//     },
    
//     removeRegistry({ state }, registryId) {
//       state.registries = state.registries.filter((registry) => registry.id!== registryId);
//     },
//     removeExpense({ state }, expenseId) {
//       state.expenses = state.expenses.filter((expense) => expense.id!== expenseId);
//     },
//     removeCategory({ state }, name) {
//       state.categories = state.categories.filter((category) => category.name!== name);
//     }
//   },
// })
// export default store;
