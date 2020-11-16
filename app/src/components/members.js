import { readable } from 'svelte/store';
export let members = readable({ loading: true, data: [] }, (set) => {
  fetch('/members.json')
    .then(response => response.json())
    .then((data) => set({ loading: false, data }));
});
