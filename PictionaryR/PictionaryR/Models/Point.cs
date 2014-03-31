using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PictionaryR.Models
{
    public class Point
    {
        public Point(double x, double y)
        {
            this.X = x;
            this.Y = y;
        }

        [JsonProperty("x")] 
        public double X { get; set; }

        [JsonProperty("y")] 
        public double Y { get; set; }
    }
}
