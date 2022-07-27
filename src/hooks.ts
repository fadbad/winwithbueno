import type { GetSession, Handle, HandleError } from "@sveltejs/kit";
import Logger from "$lib/bw/api/logger"

export const handle: Handle = async ({ event, resolve }) => {

	const { url, locals, clientAddress, params, platform, request } = event
	const query = event.url.searchParams
	
	const headers = event.request.headers
	const bearer = headers.get('authorization')
	
	if(bearer){
		event.locals.token = bearer.replace('Bearer ', '');
	}

	const response = await resolve(event);
	return response;
};

export const getSession: GetSession = (event) => {
    return {
      	token: event.locals.token ?? ''
    }
}

export const handleError:HandleError = async ({ error, event }) => {
	// Sentry.captureException(error, { event });
	Logger.log({
		level: 'error', 
		status: 500, 
		message: error.message, 
		timestamp: new Date( Date.now() ).toISOString(),
		name: error.name,
		frame: error.frame,
		...event,
		stack: error.stack,
	})
}
