function debounce(func, wait = 100) {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			func.call(this, ...args);
		}, wait);
	};
}

export default debounce;
