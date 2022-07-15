const env = i => typeof process !== 'undefined' ? process.env[i] : ''

export default {
    DATABASE_URL: env('DATABASE_URL'),
	BASE_URL: env("BASE_URL"),

	AWS_ACCESS_KEY_ID: env("AWS_ACCESS_KEY_ID"),
    AWS_SECRET_ACCESS_KEY: env("AWS_SECRET_ACCESS_KEY"),
    AWS_DEFAULT_REGION: env("AWS_DEFAULT_REGION"),
    AWS_BUCKET: env("AWS_BUCKET"),
    AWS_ENDPOINT: env("AWS_ENDPOINT"),
    AWS_URL: env("AWS_URL"),

};
