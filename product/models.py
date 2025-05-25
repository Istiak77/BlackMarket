from django.db import models
from django.core.files import File
from django.contrib.auth import get_user_model

from io import BytesIO
from PIL import Image

class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField()

    class Meta: 
        ordering = ('name',)

    def __str__(self):
        return self.name
        
    def get_absolute_url(self):
        return f'/{self.slug}/'

class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    slug = models.SlugField()
    description = models.TextField(blank=True,null=True)
    price = models.DecimalField(max_digits=6,decimal_places=2)
    image = models.ImageField(upload_to = 'uploads/', blank = True,null = True)
    thumbnail = models.ImageField(upload_to = 'uploads/',blank = True, null=True)
    date_added = models.DateTimeField(auto_now=True)

    class Meta: 
        ordering = ('-date_added',)

    def __str__(self):
        return self.name
        
    def get_absolute_url(self):
        return f'/{self.category.slug}/{self.slug}/'

    def get_image(self):
        if self.image:
            return 'http://127.0.0.1:8000' + self.image.url
        return ''

    def get_thumbnail(self):
        if self.thumbnail:
            return 'http://127.0.0.1:8000' + self.image.url
        else:
            if self.image:
                self.thumbnail = self.make_thumbnail(self.image)
                self.save()

                return 'http://127.0.0.1:8000' + self.image.url
            else:
                return ''
    
    def make_thumbnail(self,image ,size = (300,200)):
        
        img = Image.open(image)
        img.convert('RGB')
        img.thumbnail(size)

        thumb_io = BytesIO()
        img.save(thumb_io, 'JPEG', quality=85)


        thumbnail = File(thumb_io,name = image.name)

        return thumbnail

User = get_user_model()

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Order #{self.id}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"