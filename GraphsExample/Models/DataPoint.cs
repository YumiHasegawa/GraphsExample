using System.Runtime.Serialization;

namespace GraphsExample.Models
{
	public class DataPoint
	{
		public DataPoint(double x, double y)
		{
			X = x;
			Y = y;
		}

		public double X { get; set; }

		public double Y { get; set; }
	}
}
