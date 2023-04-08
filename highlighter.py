import sys
import cv2
import numpy as np

if len(sys.argv) < 3:
    print('Error: image file path and mask color are expected!')
    sys.exit(1)     

image_name = sys.argv[1]
process_color = sys.argv[2]

image_path = f'./database/images/contrasted-images/{image_name}'
imgURI = image_path
img = cv2.imread(imgURI)

hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

lower_color = []
upper_color = []

if process_color == 'red':
    lower_color = np.array([0, 50, 50])
    upper_color = np.array([10, 255, 255])
elif process_color == 'green':
    lower_color = np.array([30, 40, 40])
    upper_color = np.array([90, 255, 255])
elif process_color == 'blue':
    lower_color = np.array([90, 50, 50])
    upper_color = np.array([130, 255, 255])
else:
    print(f'Error: not expected color -> {process_color}')

mask = cv2.inRange(hsv, lower_color, upper_color)
res = cv2.bitwise_and(img, img, mask=mask)

temp_file_path = f'./database/images/highlighted-images/{image_name}'

cv2.imwrite(temp_file_path, res)

with open(temp_file_path, 'rb') as f:
    sys.stdout.buffer.write(f.read())
