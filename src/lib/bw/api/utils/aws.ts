
import config from "../config"

import { S3Client, PutObjectCommand, CreateMultipartUploadCommand } from "@aws-sdk/client-s3";

const { 
    AWS_ACCESS_KEY_ID, 
    AWS_SECRET_ACCESS_KEY, 
    AWS_DEFAULT_REGION, 
    AWS_BUCKET,
    AWS_ENDPOINT,
    AWS_URL,
} = config;

export {
    AWS_BUCKET,
    AWS_URL,
    AWS_ENDPOINT,
    PutObjectCommand
}

export const S3 = () => new S3Client({
    region: AWS_DEFAULT_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    },
    endpoint: AWS_ENDPOINT
});

export const S3_PATH = url => {
    if(!url) return ''
    return url.replace(`${AWS_URL}/`, '')
}

export const S3_URL = path => {
    if(!path) return ''
    path = S3_PATH(path)
    return `${AWS_URL}/${path}`
}
