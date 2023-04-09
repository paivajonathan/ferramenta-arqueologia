import sys
import os
import cv2
import subprocess

if len(sys.argv) < 2:
    print('File name was expected!')
    sys.exit(1)

image_name = sys.argv[1]
image_name_without_extension = os.path.splitext(image_name)[0]

image_path = f'./database/images/highlighted-images/{image_name}'

image = cv2.imread(image_path, 0)
bw_image = cv2.adaptiveThreshold(image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2)

output_path = f'./database/images/black-white-images/{image_name_without_extension}.bmp'
cv2.imwrite(output_path, bw_image)

vectorized_path = f'./database/images/vectorized-images/{image_name_without_extension}.svg'

os.chdir("./Potrace/")
command = ['potrace.exe', f'../{output_path}', '-s', '-o', f'../{vectorized_path}']

subprocess.run(command)

os.chdir("..")
with open(vectorized_path, 'rb') as f:
    sys.stdout.buffer.write(f.read())

