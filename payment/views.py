from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from sslcommerz_lib import SSLCOMMERZ
import uuid
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.shortcuts import redirect


@api_view(['POST'])
def initiate_sslcommerz_payment(request):
    data = request.data

    items = data.get('items', [])
    if not items:
        return Response({'error': 'Order items are required'}, status=400)

    total_amount = 0
    for item in items:
        # Make sure your frontend sends product, quantity, price in each item
        quantity = item.get('quantity', 0)
        price = item.get('price', 0)
        total_amount += price

    tran_id = str(uuid.uuid4())

    post_data = {
        'total_amount': total_amount,
        'currency': 'BDT',
        'tran_id': tran_id,
        'success_url': request.build_absolute_uri('/api/v1/payment/success/'),
        'fail_url': request.build_absolute_uri('/api/v1/payment/fail/'),
        'cancel_url': request.build_absolute_uri('/api/v1/payment/cancel/'),
        'emi_option': 0,
        'cus_name': f"{data.get('first_name', '')} {data.get('last_name', '')}",
        'cus_email': data.get('email'),
        'cus_phone': data.get('phone'),
        'cus_add1': data.get('address'),
        'cus_city': data.get('place'),
        'cus_country': 'Bangladesh',
        'shipping_method': 'NO',
        'product_name': 'Order Payment',
        'product_category': 'E-commerce',
        'product_profile': 'general',
    }

    sslcz = SSLCOMMERZ({
        'store_id': settings.SSLCOMMERZ_STORE_ID,
        'store_pass': settings.SSLCOMMERZ_STORE_PASS,
        'issandbox': settings.SSLCOMMERZ_IS_SANDBOX
    })

    response = sslcz.createSession(post_data)

    if response.get('status') == 'SUCCESS':
        return Response({'GatewayPageURL': response['GatewayPageURL']})
    else:
        return Response({'error': 'Payment initiation failed'}, status=400)


@csrf_exempt
def payment_success(request):
    return redirect('http://localhost:8080/payment-success')

@csrf_exempt
def payment_fail(request):
    return redirect('http://localhost:8080/payment-fail')

@csrf_exempt
def payment_cancel(request):
    return redirect('http://localhost:8080/payment-cancel')
