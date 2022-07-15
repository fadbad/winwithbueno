import jimp from 'jimp'
import moment from 'moment'
import * as fs from 'fs'
import * as path from 'path'
import { str_random, base64File } from './functions'
import { AWS_BUCKET, S3, PutObjectCommand } from './aws'

export const base64Resize = async (base64Image, w) =>{

    const { mime, data } = base64File(base64Image)
    let img = Buffer.from(data, 'base64');
    const res = await jimp.read(img)
    // const resized = await res.resize(w ?? jimp.AUTO, h ?? jimp.AUTO)
    const resized = await res.scaleToFit(w ?? jimp.AUTO, jimp.AUTO, jimp.RESIZE_BEZIER).quality(80)
    const buffer = await resized.getBase64Async(res.getMIME())
    return buffer;
}

export const base64Upload = async (base64, width = null, height = null) => {
    if(!base64) return ''
    const folder = moment(new Date()).format("YYYY/MM");
    const name = str_random(12)

    if(width || height) base64 = await base64Resize(base64, width)
  
    // const base64Data = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const base64Data = Buffer.from(base64.split("base64,")[1], 'base64');
  
    const type = base64.split(';')[0].split('/')[1];
    
    let Key = `${folder}/${name}.${type}`
    try {
        const res = await S3().send(new PutObjectCommand({
            Bucket: AWS_BUCKET,
            Key, // type is not required
            Body: base64Data,
            ACL: 'public-read',
            ContentEncoding: 'base64', // required
            ContentType: `image/${type}` // required. Notice the back ticks
        }))
        // console.log(res);
        return Key
    }   catch (error) {
        console.log(error)
        return ''
    }  
}

export const fileUpload = async (file, baseFolder = '') => {
    let folder = moment(new Date()).format("YYYY/MM");
    folder = baseFolder ? `${baseFolder}/${folder}` : folder
    const name = str_random(12)
    const ext = file.name.split('.').pop()
    let Key = `${folder}/${name}.${ext}`
    const fileStream = await file.arrayBuffer()

    try {
        await S3().send(new PutObjectCommand({
            Bucket: AWS_BUCKET,
            Key, // type is not required
            Body: fileStream,
            ContentType: file.type,
            ACL: 'public-read',
        }))
        // console.log(res);
        return Key
    }   catch (error) {
        console.log(error)
        return ''
    }
}


export const fileCoreUpload = async (file, baseFolder = null, samename = false, ContentType = null) => {
    let folder = moment(new Date()).format("YYYY/MM");
    folder = baseFolder ? `${baseFolder}/${folder}` : folder
    const ext = file.split('.').pop()
    const name = samename ? path.basename(file) : str_random(12)+'.'+ext
    let Key = `${folder}/${name}`

    console.log('name', name);
    console.log('ext', ext);
    console.log('Key', Key);
    
    try {
        const fileStream = fs.createReadStream(file)
        // console.log('fileStream', fileStream);

        fileStream.on('error', function(err) {
            console.log('File Error', err);
        });

        await S3().send(new PutObjectCommand({
            Bucket: AWS_BUCKET,
            Key, // type is not required
            Body: fileStream,
            ContentType,
            ACL: 'public-read',
        }))
        
        return Key

    }   catch (error) {
        console.log(error)
        return ''
    }
}
