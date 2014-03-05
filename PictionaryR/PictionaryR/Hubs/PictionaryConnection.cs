using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace PictionaryR.Hubs
{
    public class PictionaryHub : Hub
    {
        public void TestMessage(string name)
        {
            Clients.All.testMessage(name);
        }
    }
}