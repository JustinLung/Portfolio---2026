/**
 * Shared app-ready state — Svelte 5 equivalent of a Zustand store.
 * Pages can wait for `ready` before playing entrance animations.
 */
class AppReady {
	loaderDone = $state(false);
	transitionDone = $state(true);

	ready = $derived(this.loaderDone && this.transitionDone);

	completeLoader = () => {
		this.loaderDone = true;
	};

	startTransition = () => {
		this.transitionDone = false;
	};

	completeTransition = () => {
		this.transitionDone = true;
	};
}

export const appReady = new AppReady();
