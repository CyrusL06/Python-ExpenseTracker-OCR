#OCR work better if moved into a 

#Allo python opem image files
from PIL import Image

import pytesseract 

def extract_text_from_image(uploaded_file):
    """"
    Take an uploaded image gule from Django and return 
    OCR text.

        Uplaoded file
            THis is the file object from request.Files

        returns:
            A plan text string extracted from the image
    """

    #open uploaded image file with Pillow
    #Take file and interpret it as an image
    image = Image.open(uploaded_file)

    #Send image to Tesseract and get back with text
    #This is the core OCR step
    #Send this image into OCR engine and ask for text back
    text = pytesseract.image_to_string(image)

    #Clean up extra whitespace at the start/end
    return text.strip()