from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Subscription
from .serializers import SubscriptionSerializer
from staff.auth import StaffTokenAuthentication
from customer.auth import CustomerTokenAuthentication
from staff.models import Staff
from customer.models import Customer

class SubscriptionViewSet(APIView):
    authentication_classes = [StaffTokenAuthentication, CustomerTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = getattr(request, "user", None)
        subscriptions = Subscription.objects.all()
        if isinstance(user, Customer):
            customer_id = user.pk
            subscriptions = subscriptions.filter(customer_id=customer_id)
        else:
            customer_q = request.query_params.get('customer')
            if customer_q:
                subscriptions = subscriptions.filter(customer_id=customer_q)
        serializer = SubscriptionSerializer(subscriptions, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        user = getattr(request, "user", None)
        data = request.data.copy()
        if isinstance(user, Customer):
            data['customer'] = user.pk
        serializer = SubscriptionSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk=None, format=None):
        sub_id = pk or request.parser_context.get('kwargs', {}).get('pk')
        if not sub_id:
            return Response({"detail": "Missing id"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            subscription = Subscription.objects.get(pk=sub_id)
        except Subscription.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        partial = True
        serializer = SubscriptionSerializer(subscription, data=request.data, partial=partial)
        if serializer.is_valid():
            obj = serializer.save()
            if 'status' in request.data:
                obj.is_active = request.data.get('status') == 'active'
                obj.save()
            return Response(SubscriptionSerializer(obj).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, format=None):
        subscription = Subscription.objects.get(pk=pk)
        serializer = SubscriptionSerializer(subscription, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        subscription = Subscription.objects.get(pk=pk)
        subscription.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
