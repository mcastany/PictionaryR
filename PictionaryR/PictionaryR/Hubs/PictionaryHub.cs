using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Timers;
using PictionaryR.Models;

namespace PictionaryR.Hubs
{
    public class PictionaryHub : Hub
    {
        private static string currentCard;
        private static string userDrawing;
        private static bool hasTurnStarted = false;
        private static int timeout = 120;
        private static Timer _timer;
        private static IList<Line> lines = new List<Line>();
        private static IList<User> users = new List<User>();

        public override Task OnConnected()
        {
            if ((users.Count == 0) && (!hasTurnStarted))
            {
                userDrawing = Context.ConnectionId;
                Clients.Caller.yourTurn();
            }

            var user = new User { ConnectionId = Context.ConnectionId, Name = "Name", Points = 0 };
            users.Add(user);

            //Notification of a new user to the group and send the caller the list of users
            Clients.Others.userJoined(user);
            Clients.Caller.userList(users);

            //If there's a session in progress, send the updates to the caller
            if (hasTurnStarted)
            {
                Clients.Caller.drawInitialBoard(lines);
            }

            return base.OnConnected();
        }

        public override Task OnDisconnected()
        {
            var user = users.Where(x => x.ConnectionId == Context.ConnectionId).FirstOrDefault();
            if (user != null)
            {
                users.Remove(user);
                Clients.Others.userLeft(user);
                if (users.Count == 0)
                {
                    //No more players
                    lines.Clear();
                    hasTurnStarted = false;
                    userDrawing = string.Empty;
                    currentCard = string.Empty;
                }
            }
            return base.OnDisconnected();
        }

        public override Task OnReconnected()
        {
            // Add your own code here.
            // For example: in a chat application, you might have marked the
            // user as offline after a period of inactivity; in that case 
            // mark the user as online again.
            return base.OnReconnected();
        }

        public void PickACard()
        {
            currentCard = "Sample Card";
            Clients.Caller.sendCard(currentCard);
        }

        public void StartSession()
        {
            Clients.All.sessionStart();
            hasTurnStarted = true;

            timeout = 10;
            _timer = new Timer(1000);
            _timer.Elapsed += _timer_Elapsed;
            _timer.Start();
        }

        public void DrawLine(Line line)
        {
            if (Context.ConnectionId == userDrawing)
            {
                //We only want to let the current user draw
                lines.Add(line);
                Clients.Others.drawLine(line);
            }
        }

        public void EraseLine(Line line)
        {
            //We only want to let the current user draw
            if (Context.ConnectionId == userDrawing)
            {
                //We only want to let the current user draw
                lines.Add(line);
                Clients.Others.eraseLine(line);
            }
        }

        public void ClearBoard()
        {
            Clients.Others.clearBoard();
        }

        public void AnswerMessage(string answer)
        {
            if (answer == currentCard)
            {
                Clients.Others.sendCorrectAnswer(answer);
                _timer.Stop();
                hasTurnStarted = false;

                //Select who's next turn
                string nextUser = "";
                Clients.All.nextTurn(nextUser);
            }
            else
            {
                Clients.Others.sendIncorrectAnswer(answer);
            }
        }

        public void Message(Message message)
        {
            //Review message before emitting
            message.From = Context.ConnectionId;

            if (message.Text == currentCard)
            {
                Clients.Others.message(message);
            }
            else
            {
                Clients.Others.message(message);
            }
        }

        private void _timer_Elapsed(object sender, ElapsedEventArgs e)
        {
            //Nobody answered correct
            if (timeout-- != 0)
            {
                Clients.All.tick(timeout);
            }
            else
            {
                //Send finish
                Clients.All.timeout();
                hasTurnStarted = false;
                _timer.Stop();

                //Select new user and notify he's the one to draw
                var user = users.SkipWhile(x => x.ConnectionId == userDrawing).FirstOrDefault();
                if (user == null)
                {
                    user = users.FirstOrDefault();
                }
                userDrawing = user.ConnectionId;
                //Clients.User(userDrawing).nextTurn();
                Clients.Clients(new List<string> { userDrawing }).nextTurn();
            }

        }
    }
}