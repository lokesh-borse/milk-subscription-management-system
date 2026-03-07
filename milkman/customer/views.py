from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Customer
from .serializers import CustomerSerializer
from staff.auth import StaffTokenAuthentication
from .auth import create_token, CustomerTokenAuthentication

class CustomerViewSet(APIView):
    authentication_classes = [StaffTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        customers = Customer.objects.all()
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, format=None):
        customer = Customer.objects.get(pk=pk)
        serializer = CustomerSerializer(customer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        customer = Customer.objects.get(pk=pk)
        customer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CustomerSignupView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, format=None):
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            customer = serializer.save()
            token = create_token(customer)
            return Response(
                {
                    "token": token,
                    "customer_id": customer.pk,
                    "name": customer.name,
                    "email": customer.email,
                    "phone": customer.phone,
                    "address": customer.address,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomerLoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, format=None):
        email = request.data.get("email")
        password = request.data.get("password")
        if not email or not password:
            return Response({"detail": "Email and password required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            customer = Customer.objects.get(email=email, password=password)
        except Customer.DoesNotExist:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        token = create_token(customer)
        return Response(
            {
                "token": token,
                "customer_id": customer.pk,
                "name": customer.name,
                "email": customer.email,
                "phone": customer.phone,
                "address": customer.address,
            }
        )


class CustomerMeView(APIView):
    authentication_classes = [CustomerTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        customer = request.user
        return Response(
            {
                "customer_id": customer.pk,
                "name": customer.name,
                "email": customer.email,
                "phone": customer.phone,
                "address": customer.address,
            }
        )

    def patch(self, request, format=None):
        customer = request.user
        allowed_fields = {"name", "email", "phone", "address"}
        payload = {key: value for key, value in request.data.items() if key in allowed_fields}

        if not payload:
            return Response({"detail": "No editable fields provided."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CustomerSerializer(customer, data=payload, partial=True)
        if serializer.is_valid():
            customer = serializer.save()
            return Response(
                {
                    "customer_id": customer.pk,
                    "name": customer.name,
                    "email": customer.email,
                    "phone": customer.phone,
                    "address": customer.address,
                }
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
