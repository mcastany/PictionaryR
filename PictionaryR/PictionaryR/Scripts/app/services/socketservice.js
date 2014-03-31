angular.module('pictionaR').factory('socket', function ($rootScope) {
    var connection = $.hubConnection();
    var socket = connection.createHubProxy('pictionaryHub');
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback, error) {
            if (data) {
                socket.invoke(eventName, data)
                    .done(function () {
                        var args = arguments;
                        if (callback) {
                            $rootScope.$apply(function () {
                                callback.apply(socket, args);
                            });
                        }
                    })
                    .fail(function () {
                        var args = arguments;
                        if (error) {
                            $rootScope.$apply(function () {
                                error.apply(socket, args);
                            });
                        }
                    });
            } else {
                socket.invoke(eventName)
                    .done(function () {
                        var args = arguments;
                        if (callback) {
                            $rootScope.$apply(function () {
                                callback.apply(socket, args);
                            });
                        }
                    })
                    .fail(function () {
                        var args = arguments;
                        if (error) {
                            $rootScope.$apply(function () {
                                error.apply(socket, args);
                            });
                        }
                    });
            }
        },
        start: function () {
            connection.start();
        }
    };
});