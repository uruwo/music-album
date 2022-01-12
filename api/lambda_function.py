import json
import boto3
import mutagen.mp4
import os

print('Loading function')

s3 = boto3.resource('s3')

def lambda_handler(event, context):
  bucket = s3.Bucket('audio-tmp-bucket')
  key = 'put_folder/' + event['uuid']
  bucket.download_file(key, '/tmp/audio_tmp.m4a')
  tags = mutagen.mp4.MP4('/tmp/audio_tmp.m4a')
  title = str((tags['\xa9nam'])[0])
  artist = str((tags['\xa9ART'])[0])

  os.remove('/tmp/audio_tmp.m4a')

  return {
    'statusCode': 200,
    'headers': {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': 'http://localhost:8080',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    },
    'body': json.dumps({
      "artist": artist,
      "title": title,
    })
  }