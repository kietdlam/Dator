from tastypie.authentication import Authentication
from tastypie.fields import IntegerField, DateTimeField, CharField, BooleanField
from tastypie.resources import ModelResource
from tastypie.authorization import Authorization
from tastypie.resources import ALL_WITH_RELATIONS
from tastypie import fields
from robots.models import System, Program, Command, LocalComputer, Signal


class SystemResource(ModelResource):

    class Meta:
        queryset = System.objects.all()
        authorization = Authorization()
        authentication = Authentication()
        resource_name = 'system'
        always_return_data = True


class ProgramResource(ModelResource):

    class Meta:
        queryset = Program.objects.all()
        authorization = Authorization()
        authentication = Authentication()
        resource_name = 'program'
        always_return_data = True


class CommandResource(ModelResource):
    local_computer_id = IntegerField(attribute="local_computer_id")
    is_executed = BooleanField(attribute="is_executed")

    class Meta:
        queryset = Command.objects.all()
        authorization = Authorization()
        authentication = Authentication()
        resource_name = 'command'
        always_return_data = True
        filtering = {
            'local_computer_id': ALL_WITH_RELATIONS,
            'is_executed': ALL_WITH_RELATIONS
        }
        

class LocalComputerResource(ModelResource):

    class Meta:
        queryset = LocalComputer.objects.all()
        authorization = Authorization()
        authentication = Authentication()
        resource_name = 'local_computer'
        always_return_data = True


class SignalResource(ModelResource):
    local_computer_id = IntegerField(attribute="local_computer_id")
    system_id = IntegerField(attribute="system_id")

    class Meta:
        queryset = Signal.objects.all()
        authorization = Authorization()
        authentication = Authentication()
        resource_name = 'signal'
        always_return_data = True

        filtering = {
            'local_computer_id': ALL_WITH_RELATIONS,
            'system_id': ALL_WITH_RELATIONS
        }


class SettingResource(ModelResource):
    local_computer_id = IntegerField(attribute="local_computer_id")
    system_id = IntegerField(attribute="system_id")

    class Meta:
        queryset = System.objects.all()
        authorization = Authorization()
        authentication = Authentication()
        resource_name = 'setting'
        always_return_data = True

        filtering = {
            'local_computer_id': ALL_WITH_RELATIONS,
            'system_id': ALL_WITH_RELATIONS
        }


