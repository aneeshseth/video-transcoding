import express from 'express'
const app = express()
import multer from 'multer'
import {S3Client, PutObjectCommand, GetObjectCommand} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import cors from 'cors'
import ffmpeg from 'fluent-ffmpeg';
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);




const storage = multer.memoryStorage()
const upload = multer({storage: storage})
app.use(cors())
const s3 = new S3Client({
    credentials: {
        accessKeyId: "AKIA35VTPTMRCBRBML64",
        secretAccessKey: "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"
    },
    region: "us-east-1"
})



app.post("/api/posts",upload.single('video'), async (req,res) => {
    const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
    const params = {
        Bucket: "my-bucket-next",
        Key: req.file.originalname,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    }
    const command = new PutObjectCommand(params)
    await s3.send(command)
    console.log(command)
    const getObjectParams = {
        Bucket: "my-bucket-next",
        Key: req.file.originalname,
    }
    const command2 = new GetObjectCommand(getObjectParams)
    console.log(command2)
    const url = await getSignedUrl(s3, command2, {expiresIn: 3700})
    console.log(url)
    const outputDir = path.join(__dirname, "..", "public", "hls")
  const uniqueVal = `${Date.now()}`;
  const bitrates = ['100k', '800k', '1200k', '2400k', '3000k'];
  try {
    const ffmpegPromises = bitrates.map( async (bitrate) => {
        const outputFileName = `${bitrate}-${uniqueVal}.m3u8`;
        try {
            ffmpeg()
            .input(url)
            .outputOptions([
              '-profile:v baseline', // H.264 profile for wider devide suppoet
              '-level 3.0',  // H.264 level 
              '-start_number 0', // Segment start number
              '-hls_time 10',  // segnebt duration
              '-hls_list_size 0', // number of segments to keep in playlist (0 means all)
              '-f hls', // output format HLS
            ])
            .output(`${outputDir}/${outputFileName}`)
            .videoBitrate(bitrate)
            .audioCodec('aac')
            .audioBitrate('128k')
            .run();
            console.log("hey?")
        } catch (err) {
            console.log("ERROR")
            console.log(err)
        }
        
      }
      );
      await Promise.all(ffmpegPromises);
      console.log(ffmpegPromises)
  } catch (err) {
    console.log(err)
  }
  console.log("video?")
  return res.sendStatus(200)
})



app.listen(3002, () => {
    console.log('server running')
})