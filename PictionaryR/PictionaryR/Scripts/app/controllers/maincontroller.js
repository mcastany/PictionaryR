'use strict';

angular.module('pictionaR').controller('mainController', ['$scope', 'socket', function ($scope, socket) {
    $scope.users = [];
    $scope.chat = [];
    $scope.lines = [];
    $scope.messages = [];
    $scope.time = 0;
    $scope.myTurn = false;
    $scope.cardPicked = false;
    $scope.sessionStarted = false;
    $scope.settings = {
        lineJoin: 'round',
        lineWidth: 2,
        strokeStyle: 'black',
        draw: true
    };

    $scope.setDrawLine = function () {

    };

    $scope.setDrawDot = function () {
        
    };

    $scope.startDrawing = function () {
        socket.emit('startSession');
    }

    $scope.pickACard = function () {
        socket.emit('pickACard');
    };

    $scope.sendMessage = function () {
        if ($scope.text) {
            var message = {
                text: $scope.text,
                from: 'me',
                date: new Date()
            };
            $scope.chat.push(message);
            socket.emit('message', message);
            $scope.text = '';
        }
    }

    $scope.cleanCanvas = function () {
        $scope.lines = [];
        socket.emit('clearBoard');
    };

    socket.on('userJoined', function (user) {
        $scope.users.push(user);
    });

    socket.on('userLeft', function (user) {
        var position = -1;
        angular.forEach($scope.users, function (item, pos) {
            if (item.ConnectionId == user.ConnectionId) {
                position = pos;
            }
        })
        if (position > -1)
            $scope.users.splice(position, 1);
    });

    socket.on('yourTurn', function () {
        $scope.myTurn = true;
        $scope.cardPicked = false;
        $scope.sessionStarted = false;
    });

    socket.on('userList', function (users) {
        $scope.users = users;
    });

    socket.on('sendCard', function (card) {
        $scope.cardPicked = true;
        $scope.sessionStarted = false;
        $scope.card = card;
    });

    socket.on('sessionStart', function () {
        $scope.sessionStarted = true;
    });

    socket.on('drawInitialBoard', function (lines) {
        $scope.lines = lines;
    });

    socket.on('drawLine', function (line) {
        $scope.lines.push(line);
    });

    socket.on('eraseLine', function (line) {
        $scope.lines.push(line);
    });

    socket.on('clearBoard', function () {
        $scope.lines = [];
    });

    socket.on('sendCorrectAnswer', function () {
        $scope.myTurn = false;
        $scope.cardPicked = false;
        $scope.sessionStarted = false;
    });

    socket.on('sendIncorrectAnswer', function () {

    });

    socket.on('nextTurn', function () {
        $scope.myTurn = true;
        $scope.cardPicked = false;
        $scope.sessionStarted = false;
    });

    socket.on('message', function (message) {
        $scope.chat.push(message);
    });

    socket.on('tick', function (time) {
        $scope.time = time;
    });

    socket.on('timeout', function () {
        $scope.sessionStarted = false;
        $scope.cardPicked = false;
        $scope.myTurn = false;
    });

    socket.start();
}]);


