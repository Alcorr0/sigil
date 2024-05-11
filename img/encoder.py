import base64
from PIL import Image
from io import BytesIO
import pyperclip

while(1):
	with open(input() + ".png", "rb") as image_file:
		data = base64.b64encode(image_file.read())

	res = data.decode()
	print(res)
	pyperclip.copy(res)
