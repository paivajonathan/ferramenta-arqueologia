import sys
import cv2
import numpy as np
# from PIL import Image

if len(sys.argv) < 2:
    print('Error: image file path not provided')
    sys.exit(1)     

image_name = sys.argv[1]
process_color = sys.argv[2]

# Load the image
image_path = f'./database/images/raw-images/{image_name}'
imgURI = image_path
img = cv2.imread(imgURI)

# Convert the image to HSV color space
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

lower_color = []
upper_color = []

# Define the range of the wanted color for processing
if process_color == 'red':
    lower_color = np.array([0, 50, 50])
    upper_color = np.array([30, 255, 255])
elif process_color == 'green':
    lower_color = np.array([60, 25, 25])
    upper_color = np.array([180, 255, 255])
elif process_color == 'blue':
    lower_color = np.array([90, 50, 50])
    upper_color = np.array([130, 255, 255])
else:
    print(f'Error: not expected color -> {process_color}')

# Create a mask for pixels that are within the range of red color
mask = cv2.inRange(hsv, lower_color, upper_color)

# Apply the mask to the original image
res = cv2.bitwise_and(img, img, mask=mask)

# Save the processed image to a specified file path
temp_file_path = f'./database/images/highlighted-images/temp/highlightedTempImage-{image_name}'

cv2.imwrite(temp_file_path, res)



# try:
#     image = Image.open(image_path)
# except Exception as e:
#     print(f"Error: failed to open image file '{image_path}': {e}")
#     sys.exit(1)

# bw_image = image.convert('L')

# temp_file_path = f'./database/images/highlighted-images/temp/highlightedTempImage-{image_name}'

# bw_image.save(temp_file_path)

with open(temp_file_path, 'rb') as f:
    sys.stdout.buffer.write(f.read())
