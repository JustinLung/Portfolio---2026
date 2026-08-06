const HEADER_SELECTOR = '.header';

export function observeHeaderHeight(onHeightChange: (height: number) => void): () => void {
	const header = document.querySelector<HTMLElement>(HEADER_SELECTOR);

	if (!header) {
		onHeightChange(0);
		return () => {};
	}

	const updateHeaderHeight = () => {
		onHeightChange(header.getBoundingClientRect().height);
	};

	updateHeaderHeight();

	const resizeObserver = new ResizeObserver(updateHeaderHeight);
	resizeObserver.observe(header);

	return () => resizeObserver.disconnect();
}
