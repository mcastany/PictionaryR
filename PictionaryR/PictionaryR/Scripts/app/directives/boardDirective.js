'use strict';

angular.module('pictionaR').directive('board', ['socket', function (socket) {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            started: '=',
            yourTurn: '=',
            cardPicked: '=',
            settings: '=',
            lines: '='
        },
        link: function (scope, element, attrs) {
            var ctx = element[0].getContext('2d'),
                drawing = false,
                canDraw = false;

            var lastX;
            var lastY;

            element.bind('mousedown', function (event) {
                if (canDraw) {
                    if (event.offsetX !== undefined) {
                        lastX = event.offsetX;
                        lastY = event.offsetY;
                    } else { // Firefox compatibility
                        lastX = event.layerX - event.currentTarget.offsetLeft;
                        lastY = event.layerY - event.currentTarget.offsetTop;
                    }

                    drawing = true;
                    draw(lastX - 1, lastY, lastX, lastY);
                    sendMessage(lastX - 1, lastY, lastX, lastY);
                }
            });
            element.bind('mousemove', function (event) {
                var currentX, currentY;
                if (canDraw && drawing) {
                    // get current mouse position
                    if (event.offsetX !== undefined) {
                        currentX = event.offsetX;
                        currentY = event.offsetY;
                    } else {
                        currentX = event.layerX - event.currentTarget.offsetLeft;
                        currentY = event.layerY - event.currentTarget.offsetTop;
                    }

                    draw(lastX, lastY, currentX, currentY);
                    sendMessage(lastX, lastY, currentX, currentY);
                    // set current coordinates to last one
                    lastX = currentX;
                    lastY = currentY;
                }

            });
            element.bind('mouseup', function (event) {
                // stop drawing
                drawing = false;
            });

            function getLine(to, from) {
                return {
                    From: from || null,
                    To: to
                }
            }

            function sendMessage(lastX, lastY, currentX, currentY) {
                if (scope.settings && scope.settings.draw) {
                    socket.emit('drawLine',
                        {
                            color: scope.settings.color || 'black',
                            from: {
                                x: lastX,
                                y: lastY
                            },
                            to: {
                                x: currentX,
                                y: currentY
                            }
                        });
                } else {
                    socket.emit('eraseLine', {
                        color: 'white',
                        from: {
                            x: lastX,
                            y: lastY
                        },
                        to: {
                            x: currentX,
                            y: currentY
                        }
                    });
                }
            }

            function draw(lX, lY, cX, cY, color) {
                ctx.lineJoin = scope.settings.lineJoin || 'round';
                ctx.lineWidth = scope.settings.lineWidth || 2;
                ctx.strokeStyle = color || scope.settings.color || 'black';
                ctx.beginPath();

                ctx.moveTo(lX, lY);
                ctx.lineTo(cX, cY);

                // draw it
                ctx.closePath();
                ctx.stroke();
            }

            scope.$watch('lines', function (value) {
                if (value.length > 0) {
                    angular.forEach(value, function (item, pos) {
                        var line = item;
                        draw(line.from.x, line.from.y, line.to.x, line.to.y, line.color);
                    })
                    value.splice(0, value.length - 1);
                } else {
                    ctx.clearRect(0, 0, element[0].width, element[0].height);
                }
            }, true);

            scope.$watch('clear', function (value) {
                ctx.clearRect(0, 0, element[0].width, element[0].height);
            });

            scope.$watchCollection('[started, yourTurn, cardPicked]', function (value) {
                if (value.filter(function (value) { return value == false; }).length === 0) {
                    canDraw = true;
                } else {
                    canDraw = false;
                }
            })
        }
    };
}]);
