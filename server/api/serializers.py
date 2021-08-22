from .models import NewContractModel, Campany
from rest_framework import serializers


class CampanySeriaizer(serializers.ModelSerializer):
    class Meta:
        model = Campany
        fields = '__all__'


class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewContractModel
        exclude = ['id']

    def create(self, validated_data):
        return NewContractModel.objects.create(**validated_data)

    #     def update(self, instance, validated_data):
    #         instance.title = validated_data.get('title', instance.title)
    #         instance.description = validated_data.get('description', instance.description)
    #         instance.body = validated_data.get('body', instance.body)
    #         instance.author_id = validated_data.get('author_id', instance.author_id)
    #         instance.save()
    #         return instance
