import App from './App.svelte';

const app = new App({
	target: document.body,
  props: {
    language: 'fr',
    gender: 'm',
  }
});

export default app;