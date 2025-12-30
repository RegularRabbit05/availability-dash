export default {
	async fetch(request, env, ctx) {
		if (request.url.includes('/status')) {
			const url = new URL(request.url);
			url.hostname = env.BACKEND_HOSTNAME;
			const modifiedRequest = new Request(url.toString(), request);
			let result = fetch(modifiedRequest);
			result = await result;
			if (result.headers.has('Location')) {
				const location = new URL(result.headers.get('Location'));
				location.hostname = new URL(request.url).hostname;
				const newHeaders = new Headers(result.headers);
				newHeaders.set('Location', location.toString());
				return new Response(result.body, {
					status: result.status,
					statusText: result.statusText,
					headers: newHeaders,
				});
			}
			return result;
		}
		if (request.url.includes('/nodes')) {
			let result = await fetch(env.NODES_LINK);
			return result;
		}
		return new Response('Not Found', { status: 404 });
	},
};
