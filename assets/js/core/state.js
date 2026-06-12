const state = {
  currentUser: null,
  currentProfile: null,
  allItems: [],
  currentCategory: 'todos',
  currentSearchTerm: ''
};

export function getState() {
  return state;
}

export function setState(updates) {
  Object.assign(state, updates);
  return state;
}

export function setCurrentUser(currentUser) {
  state.currentUser = currentUser;
  return currentUser;
}

export function setCurrentProfile(currentProfile) {
  state.currentProfile = currentProfile;
  return currentProfile;
}

export function setAllItems(allItems) {
  state.allItems = allItems;
  return allItems;
}

export function setCurrentCategory(currentCategory) {
  state.currentCategory = currentCategory;
  return currentCategory;
}

export function setCurrentSearchTerm(currentSearchTerm) {
  state.currentSearchTerm = currentSearchTerm;
  return currentSearchTerm;
}

export function resetState() {
  state.currentUser = null;
  state.currentProfile = null;
  state.allItems = [];
  state.currentCategory = 'todos';
  state.currentSearchTerm = '';
}
