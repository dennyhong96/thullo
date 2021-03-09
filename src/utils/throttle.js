function throttle(fn, wait = 100) {
	let timeout = null;
	return function (...args) {
		if (timeout === null) {
			timeout = setTimeout(() => {
				fn.call(this, ...args);
				timeout = null;
			}, wait);
		}
	};
}

export default throttle;
