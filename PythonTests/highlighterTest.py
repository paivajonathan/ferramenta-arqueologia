

import cv2
import numpy as np

# Carrega a imagem
imgURI = 'contrastedImage.png'
img = cv2.imread(imgURI)

# Converte a imagem para o espaço de cor HSV
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

# Define a faixa de cor vermelha
lower_red = np.array([0, 50, 50])
upper_red = np.array([20, 255, 255])

# Cria uma máscara para os pixels que estão dentro da faixa de cor vermelha
mask = cv2.inRange(hsv, lower_red, upper_red)

# Aplica a máscara na imagem original
res = cv2.bitwise_and(img, img, mask=mask)

cv2.namedWindow('Imagem com realce na cor vermelha', cv2.WINDOW_NORMAL)
cv2.resizeWindow('Imagem com realce na cor vermelha', 800, 600)


# Mostra a imagem resultante
cv2.imshow('Imagem com realce na cor vermelha', res)
cv2.waitKey(0)
cv2.destroyAllWindows()
