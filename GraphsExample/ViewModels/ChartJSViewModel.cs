using GraphsExample.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GraphsExample.ViewModels
{
    public class ChartJSViewModel
    {
        public long Id { get; set; }
        public List<DataPoint> Values { get; set; }
    }
}
