using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PictionaryR.Models
{
    public class Line
    {
         [JsonProperty("color")] 
        public string Color { get; set; }

        [JsonProperty("from")] 
        public Point From { get; set; }

        [JsonProperty("to")] 
        public Point To { get; set; }

        [JsonProperty("type")] 
        public LineType Type { get; set; }
    }

    public enum LineType
    {
        Erase = 0,
        Draw
    }
}

