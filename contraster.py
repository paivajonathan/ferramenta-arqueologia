import sys
from PIL import Image, ImageEnhance

if len(sys.argv) < 3:
    print('Error: file and contrast value were expected!')
    sys.exit(1)

image_name = sys.argv[1]
image_path = f'./database/images/raw-images/{image_name}'

contrast_value = float(sys.argv[2])

image = Image.open(image_path)

enhancer = ImageEnhance.Contrast(image)

image_output = enhancer.enhance(contrast_value)

output_path = f'./database/images/contrasted-images/{image_name}'
image_output.save(output_path)

with open(output_path, 'rb') as f:
    sys.stdout.buffer.write(f.read())



