from rest_framework import serializers
from .models import Category, Product, Order, OrderItem

class ProductSerializer(serializers.ModelSerializer):
    class Meta: 
     model = Product
     fields = (
        "id",
        "name",
        "get_absolute_url",
        "description",
        "price",
        "get_image",
        "get_thumbnail"
     )

class CategorySerializer(serializers.ModelSerializer):
   products = ProductSerializer(many =True)

   class Meta:
      model = Category
      fields = (
         "id",
         "name",
         "get_absolute_url",
         "products",
      )

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'price', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'created_at', 'status', 'items']