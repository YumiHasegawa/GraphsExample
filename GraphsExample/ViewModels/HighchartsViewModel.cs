using GraphsExample.Models;
using System.Collections.Generic;

namespace GraphsExample.ViewModels
{
    public class HighchartsViewModel
    {
        public long Id { get; set; }
        public List<DataPoint> Values { get; set; }
    }
}
