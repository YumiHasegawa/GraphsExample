using System;
using System.Collections.Generic;

namespace GraphsExample.ViewModels
{
    public class MicrosoftChartsViewModel
    {
        public long Id { get; set; }
        public Dictionary<DateTime, decimal> Values { get; set; }
    }
}
