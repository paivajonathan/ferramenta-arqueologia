import sys
import os
from PIL import Image, ImageFilter

if len(sys.argv) < 2:
    print('File name was expected!')
    sys.exit(1)

image_name = sys.argv[1]
image_path = f'./database/images/highlighted-images/{image_name}'

image = Image.open(image_path)

output_image = image.filter(ImageFilter.GaussianBlur(2))

output_path = f'./database/images/vectorized-images/{image_name}'
output_image.save(output_path)

with open(output_path, 'rb') as f:
    sys.stdout.buffer.write(f.read())

