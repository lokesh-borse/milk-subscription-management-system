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
    # We'll perform auth checks manually so that customer tokens and staff tokens
    # don't short-circuit each other (custom authenticators raise on bad signature).
    authentication_classes = []
    permission_classes = [AllowAny]

    def _authenticate_customer_or_staff(self, request):
        # try customer first, then staff
        from rest_framework import exceptions
        cust_auth = CustomerTokenAuthentication()
        staff_auth = StaffTokenAuthentication()
        try:
            rv = cust_auth.authenticate(request)
            if rv is not None:
                return rv  # (user, payload)
        except exceptions.AuthenticationFailed:
            # ignore and try staff
            pass
        try:
            rv = staff_auth.authenticate(request)
            if rv is not None:
                return rv
        except exceptions.AuthenticationFailed:
            # no valid token
            return None
        return None

    def get(self, request, format=None):
        # attach user if we can authenticate
        auth_result = self._authenticate_customer_or_staff(request)
        user = auth_result[0] if auth_result else getattr(request, "user", None)
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
        auth_result = self._authenticate_customer_or_staff(request)
        user = auth_result[0] if auth_result else None
        data = request.data.copy()
        if isinstance(user, Customer):
            data['customer'] = user.pk
        serializer = SubscriptionSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk=None, format=None):
        # require authentication for patch
        auth_result = self._authenticate_customer_or_staff(request)
        if not auth_result:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        user = auth_result[0]
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
