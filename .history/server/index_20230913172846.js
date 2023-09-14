import express from 'express'
const app = express()
import multer from 'multer'
import {S3Client, PutObjectCommand, GetObjectCommand} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'




app.listen(3001, () => {
    console.log('server running')
})