from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response

#BackendStacks needed
#MultiParser
#Tesseract OCR
#Pytesseract
#Pillow
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status 

#allows any to be acall with this endpotint for now
from rest_framework.permissions import AllowAny

# Import the OCR helper function we made
from .services import extract_text_from_image

# Create your views here.


class HelloView(APIView):
    def get(self, request):
        return Response({"message": "Hello from Django"})
    

class BruhView(APIView):
    def get(self,request):
        return Response({"message": "HOLLA"})
    
#Class hat handles request for one endpoint
class OCR_view(APIView):
    #Settings for vieww
    authentication_classes = []
    permission_classes = [AllowAny]
    
    #Parses tells tgat endpoint will receive form-data / file upploads
    parser_classes = [MultiPartParser, FormParser]
  

    def post(self, request):
        """
        Method runs when someone send POST request
        to /api/ocr
        """

        uploaded_file = request.FILES.get("file")

        if not uploaded_file:
            return Response(
                {"error": "No FIle was uploaded"},
                status = status.HTTP_400_BAD_REQUEST,
            )
        
        try:
            #Run the OCR
            extracted_text = extract_text_from_image(uploaded_file)

            #Return the OCRS result
            return Response(
                {
                    "message": "OCR COmpleted successfully",
                    "filename": uploaded_file.name,
                    "content_type": uploaded_file.content_type,
                    "text": extracted_text
                },
                status=status.HTTP_200_OK
            )
        
            

        except Exception as ex:
            #if something goes wrong
             return Response(
             {
                "message": "POST request worked",
                "filename": uploaded_file.name,
                "size": uploaded_file.size,
                "content-type": uploaded_file.content_type,
             },
                status= status.HTTP_200_OK,
            
        )
       
