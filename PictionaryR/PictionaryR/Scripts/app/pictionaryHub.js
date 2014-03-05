var pictionaryHub = $.connection.pictionaryHub;

pictionaryHub.client.connect = function () {
    status.text('status: online | Click Ready to draw! button to start drawing');
    chatinput.removeProp('disabled');
    chatnick.removeProp('disabled');
    chatinput.focus();
};

pictionaryHub.client.drawCanvas = function (canvasToDraw) {
    if (canvasToDraw) {
        canvas.width(canvas.width());
        context.lineJoin = 'round';
        context.lineWidth = 2;

        for (var i = 0; i < canvasToDraw.length; i++) {
            var line = canvasToDraw[i];
            context.strokeStyle = line.color;
            context.beginPath();
            if (line.from) {
                context.moveTo(line.from.x, line.from.y);
            } else {
                context.moveTo(line.to.x - 1, line.to.y);
            }
            context.lineTo(line.to.x, line.to.y);
            context.closePath();
            context.stroke();
        }
    }
};

pictionaryHub.client.clearCanvas = function () {
    context.clearRect(0, 0, canvas.width(), canvas.height());
};

pictionaryHub.client.youDraw = function (word) {
    myturn = true;
    canvas.css('background-color', '#fff');
    myword = word;
    status.text('status: online | Your word is: ' + myword[0] + ' (difficulty: ' + myword[1] + ')');
    readytodraw.prop('value', 'Pass (' + timeleft + ')');

    // turn on drawing timer
    drawingTimer = setInterval(timerTick, 1000);
};

pictionaryHub.client.firendDraw = function (msg) {
    if (!myturn) {
        status.text('status: online | ' + msg.nick + ' is drawing right now!');
    }

    chatcontent.append('<p>&raquo; <span style="color:' + msg.color + '">' + msg.nick + '</span> is drawing!</p>');
    chatScrollDown();
};

pictionaryHub.client.youCanDraw = function (msg) {
    if (myturn) {
        myturn = false;
        canvas.css('background-color', '#ccc');
        status.text('status: online | Click Ready to draw! button to start drawing');
    }
    chatcontent.append('<p>Click <strong>Ready to draw!</strong> button to draw.</p>');
    chatScrollDown();
};

pictionaryHub.client.wordGuessed = function (msg) {
    chatcontent.append('<p>&raquo; <span style="color:' + msg.color + '">' + msg.nick + '</span> guessed the word (<strong>' + msg.text + '</strong>) !!!</p>');
    chatScrollDown();
    if (myturn = true) {
        timeleft = 120;
        clearInterval(drawingTimer);
        drawingTimer = null;
        readytodraw.prop('value', 'Ready to draw!');
    }
};

pictionaryHub.client.wordNotGuessed = function (msg) {
    chatcontent.append('<p>&raquo; The turn is over! The word was <strong>' + msg.text + '</strong>.</p>');
    chatScrollDown();
    if (myturn = true) {
        timeleft = 120;
        clearInterval(drawingTimer);
        drawingTimer = null;
        readytodraw.prop('value', 'Ready to draw!');
    }
};

pictionaryHub.client.users = function (users) {
    people.text('');
    for (var i in users) {
        people.append('<p>' + users[i].score + ' | <span style="color:' + users[i].color + '">' + users[i].nick + '</span></p>');
    }
};

pictionaryHub.client.message = function (msg) {
    chatcontent.append('<p><span style="color:' + msg.color + '">' + msg.nick + '</span>: ' + msg.text + '</p>');
    chatScrollDown();
};

pictionaryHub.client.userJoined = function (user) {
    chatcontent.append('<p>&raquo; <span style="color:' + user.color + '">' + user.nick + '</span> joined.</p>');
    chatScrollDown();
};

pictionaryHub.client.userLeft = function (user) {
    chatcontent.append('<p>&raquo; <span style="color:' + user.color + '">' + user.nick + '</span> left.</p>');
    chatScrollDown();
};