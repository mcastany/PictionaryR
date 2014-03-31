using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PictionaryR.Models
{
    public class Message
    {
        [JsonProperty("text")]
        public string Text { get; set; }

        [JsonProperty("from")]
        public string From { get; set; }

        [JsonProperty("date")]
        public string Date { get; set; }

    }
}