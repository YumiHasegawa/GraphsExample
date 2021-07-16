using System.Collections.Generic;

namespace GraphsExample.Models
{
    public static class MySiteMap
    {
        private static readonly IList<SiteMapItem> _items = new List<SiteMapItem>();

        public static IEnumerable<SiteMapItem> GetAll()
        {
            return _items;
        }

        static MySiteMap()
        {
            _items.Add(new SiteMapItem { Name = "MicrosoftCharts", Controller = "MicrosoftCharts", Action = "Index" });
        }
    }
}