from rest_framework import generics, filters
from rest_framework.permissions import IsAdminUser, AllowAny
from .models import Article
from .serializers import ArticleSerializer


class ArticleListView(generics.ListAPIView):
    queryset = Article.objects.filter(is_published=True)
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'short_description', 'content', 'tags']
    ordering_fields = ['published_date', 'title']

    def get_queryset(self):
        queryset = super().get_queryset()
        material_type = self.request.query_params.get('type')
        if material_type:
            queryset = queryset.filter(type=material_type)
        return queryset


class ArticleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAdminUser()]
        return [AllowAny()]
