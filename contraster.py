from PIL import Image, ImageEnhance

image_path = './database/images/raw-images/PinturaRupestreRaw.jpeg'
image = Image.open(image_path)

enhancer = ImageEnhance.Contrast(image)

factor = 2
im_output = enhancer.enhance(factor)
im_output.save('contrastedImage.png')


