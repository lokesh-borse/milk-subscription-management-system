from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import exceptions
from .models import Category
from .serializers import CategorySerializer
from staff.auth import StaffTokenAuthentication

class CategoryViewSet(APIView):
    # allow anyone to GET categories; require staff token for write operations
    authentication_classes = []
    permission_classes = [AllowAny]

    def _require_staff(self, request):
        auth = StaffTokenAuthentication()
        try:
            rv = auth.authenticate(request)
        except exceptions.AuthenticationFailed:
            raise exceptions.NotAuthenticated('Staff credentials required')
        if rv is None:
            raise exceptions.NotAuthenticated('Staff credentials required')
        return rv

    def get(self, request, format=None):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        # require staff auth
        self._require_staff(request)
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, format=None):
        # require staff auth
        self._require_staff(request)
        category = Category.objects.get(pk=pk)
        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        # require staff auth
        self._require_staff(request)
        category = Category.objects.get(pk=pk)
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
