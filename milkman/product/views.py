from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import exceptions
from .models import Product
from .serializers import ProductSerializer
from staff.auth import StaffTokenAuthentication

class ProductViewSet(APIView):
    # allow anyone to GET the list/details; require staff token for write operations
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

    def get(self, request, pk=None, format=None):
        if pk is not None:
            try:
                product = Product.objects.get(pk=pk)
            except Product.DoesNotExist:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
            serializer = ProductSerializer(product)
            return Response(serializer.data)

        products = Product.objects.all()
        category_id = request.query_params.get('category')
        if category_id:
            products = products.filter(category_id=category_id)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        # require staff auth
        self._require_staff(request)
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, format=None):
        # require staff auth
        self._require_staff(request)
        product = Product.objects.get(pk=pk)
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        # require staff auth
        self._require_staff(request)
        product = Product.objects.get(pk=pk)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
