function LocalComputer($scope, $routeParams, $interval, Restangular) {

    $scope.saveComputer = function () {
        $scope.localComputer.save().then(function (computer) {
            alert("Saved Computer");
            $scope.getComputer();
        }, function (reason) {
            alert("Failed to Save " + reason);
        });
    };

    $scope.getComputer = function () {
        return Restangular.one("local_computer", $routeParams.id).get().then(function (localComputer) {
            $scope.localComputer = localComputer;
            $scope.getSignals();
            $scope.getSettings();
        }, function (reason) {
            alert("Couldn't load localComputer: " + reason);
        });
    };

    $scope.getComputerStatus = function () {
        return Restangular.one("local_computer", $routeParams.id).get().then(function (localComputer) {
            $scope.localComputer.is_running = localComputer.is_running;
        }, function (reason) {
            console.log("Couldn't load localComputer: " + reason);
        });
    };

    $scope.getPrograms = function () {
        return Restangular.all("program").getList().then(function (programs) {
            $scope.programs = programs;
        }, function (reason) {
            alert("Couldn't load programs: " + reason)
        });
    };

    /**
     * Send a COMMAND_DONE to the local computer
     */
    $scope.stopComputer = function () {
        var command = {};
        command.type = COMMAND_DONE;
        command.local_computer_id = $scope.localComputer.id;


        return Restangular.all("command").post(command, "", {}, {}).then(function () {
            alert("Sent shutdown to box");
        }, function (reason) {
            alert("Couldn't shutdown local computer: " + reason);
        });
    };

    /**
     * Send a COMMAND_LOAD_PROGRAM to the local computer
     */
    $scope.loadProgram = function (program_id) {
        var command = {};
        command.type = COMMAND_LOAD_PROGRAM;
        command.local_computer_id = $scope.localComputer.id;
        command.json_command = JSON.stringify({'program_id': program_id});


        return Restangular.all("command").post(command, "", {}, {}).then(function () {
            alert("Requested program start");
        }, function (reason) {
            alert("Couldn't start program on local computer: " + reason);
        });
    };

    /**
     * Send a COMMAND_STOP_PROGRAM to the local computer
     */
    $scope.stopProgram = function (program_id) {
        var command = {};
        command.type = COMMAND_STOP_PROGRAM;
        command.local_computer_id = $scope.localComputer.id;
        command.json_command = JSON.stringify({'program_id': program_id});


        return Restangular.all("command").post(command, "", {}, {}).then(function () {
            alert("Requested program stop");
        }, function (reason) {
            alert("Couldn't stop program on local computer: " + reason);
        });
    };

    /**
     * Get a list of signals associated with the computer.
     */
    $scope.getSignals = function () {
        return Restangular.all("signal").getList({format:'json', local_computer_id: $scope.localComputer.id}).
            then(function (data){
                $scope.signals = data;
        });
    };

    /**
     * Get a list of settings associated with the computer.
     */
    $scope.getSettings = function () {
        return Restangular.all("setting").getList({format:'json', local_computer_id: $scope.localComputer.id}).
            then(function (data){
                $scope.settings = data;
        });
    };



    $scope.getComputer();
    $scope.getPrograms();


    var promise = $interval($scope.getComputerStatus, 5000);

    // Cancel interval on page changes
    $scope.$on('$destroy', function () {
        if (angular.isDefined(promise)) {
            $interval.cancel(promise);
            promise = undefined;
        }
    });

    $scope.newProgram = function(){
        return Restangular.all("program").post({name:"new program", code:""}).then(function (created){
            $scope.getPrograms();
        });
    };

    $scope.deleteProgram = function(programId){
        var program = _.find($scope.programs, function(program){
            return program.id == programId;
        });
        return Restangular.one("program", program.id).get().then(function(foundProgram){
            foundProgram.remove().then(
                function(removeStatus){
                    $scope.getPrograms();
                });
        });
    };

}

angular.module('Ruenoor').controller('LocalComputer',
    ['$scope', '$routeParams', '$interval', 'Restangular', LocalComputer]);