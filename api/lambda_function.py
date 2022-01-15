import json
import boto3
import uuid
import mutagen.mp4
import os
from io import BytesIO
from PIL import Image

print('Loading function')

s3 = boto3.resource('s3')

def lambda_handler(event, context):
  bucket = s3.Bucket('audio-tmp-bucket')

  key_audio = 'audio/' + event['uuid']

  bucket.download_file(key_audio, '/tmp/audio_tmp.m4a')
  tags = mutagen.mp4.MP4('/tmp/audio_tmp.m4a')

  title = str((tags['\xa9nam'])[0])
  artist = str((tags['\xa9ART'])[0])

  apic = tags.get('covr')
  cover_img = Image.open(BytesIO(apic[0]))
  cover_img.save('/tmp/image_tmp.jpg')

  image_name = str(uuid.uuid4()) + '.jpg'
  key_image = 'image/' + image_name
  bucket.upload_file('/tmp/image_tmp.jpg', key_image, ExtraArgs={'ContentType': 'image/jpg'})

  os.remove('/tmp/audio_tmp.m4a')
  os.remove('/tmp/image_tmp.jpg')

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
      "image_name": image_name
    }, ensure_ascii=False)
  }