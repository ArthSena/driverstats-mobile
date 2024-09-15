
import { createStore } from 'framework7';
import {v4 as uuidv4} from 'uuid';

const store = createStore({
  state: {
    registries: [
      {
        id: 'fd524219-bf70-429e-97f2-ed3afed40c25',
        createdAt: '13/09/2024 15:19',
        closedAt: '',
        status: 'OPPENED',
        initialMileage: 0,
        finalMileage: 132.52,
        billed: 124.25,
        trips: 8,
      },
      {
        id: '6b450f6b-f1de-4b9f-84a5-d912aa5f5eca',
        createdAt: '13/09/2024 15:19',
        closedAt: '13/09/2024 22:19',
        status: 'CLOSED',
        initialMileage: 0,
        finalMileage: 132.52,
        billed: 124.25,
        trips: 8,
      },
      {
        id: '88e5ff2a-4da3-482d-9561-fbf53e495b46',
        createdAt: '13/09/2024 15:19',
        closedAt: '13/09/2024 22:19',
        status: 'CLOSED',
        initialMileage: 0,
        finalMileage: 132.52,
        billed: 124.25,
        trips: 8,
      },
    ],
    expenses: [
      {
        id: '88e5ff2a-4da3-482d-9561-fbf53e495b46',
        date: '13/09/2024',
        category: 'Business',
        description: 'Fuel lorem ipsum dolor sit amet, consectetur t',
        amount: 50.25,
      },
      {
        id: '88e5ff2a-4da3-482d-9561-fbsf3e495b46',
        date: '13/09/2024',
        category: 'Food',
        description: 'Market',
        amount: 72.21,
      }
    ],
    categories: [
      {
        id: '1',
        name: 'Business',
      },
      {
        id: '2',
        name: 'Food',
      },
      {
        id: '3',
        name: 'Transportation',
      },
      {
        id: '4',
        name: 'Health',
      },
      {
        id: '5',
        name: 'Other',
      },
    ]
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
    addRegistry({ state }, registry) {
      state.registries = [...state.registries, registry];
    },
    addExpense({ state }, expense) {
      state.expenses = [...state.expenses, expense];
    },
    addCategory({ state }, name) {
      state.categories = [...state.categories, {
        id: uuidv4(),
        name
      }];
    },
    
    removeRegistry({ state }, registryId) {
      state.registries = state.registries.filter((registry) => registry.id!== registryId);
    },
    removeExpense({ state }, expenseId) {
      state.expenses = state.expenses.filter((expense) => expense.id!== expenseId);
    },
    removeCategory({ state }, name) {
      state.categories = state.categories.filter((category) => category.name!== name);
    }
  },
})
export default store;
