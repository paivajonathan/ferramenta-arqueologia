import cv2
import numpy as np
import potrace

# Carregue a imagem segmentada
imagem_segmentada = cv2.imread("highlightedImage.jpg", cv2.IMREAD_GRAYSCALE)

# Aplique uma limiarização para binarizar a imagem segmentada
_, imagem_binaria = cv2.threshold(imagem_segmentada, 127, 255, cv2.THRESH_BINARY)

# Crie um objeto Potrace a partir da imagem binária
bitmap = potrace.Bitmap(imagem_binaria)

# Vetorize a imagem usando o método potrace
path = bitmap.trace()

# Crie uma imagem vazia para desenhar o resultado vetorizado
imagem_vetorizada = np.zeros_like(imagem_segmentada)

# Desenhe o resultado vetorizado na imagem vetorizada
for curve in path:
    pontos = curve.to_points()
    pontos = np.array(pontos, dtype=np.int32)
    cv2.fillPoly(imagem_vetorizada, [pontos], 255)

# Salve a imagem vetorizada em um arquivo
cv2.imwrite("imagem_segmentada_vetorizada.png", imagem_vetorizada)
