using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EmilyEMRVS.Lib
{
    public static class Fun
    {
        public static DateTime? toUtc(DateTime? dt)
        {
            if (dt == null)
            {
                return null;
            }
            else
            {
                return TimeZoneInfo.ConvertTimeToUtc(dt.Value);
            }
        }

        public static DateTime? fromUtc(DateTime? dt, TimeZoneInfo tzi)
        {
            if (dt == null)
            {
                return null;
            }
            else
            {
                return TimeZoneInfo.ConvertTimeFromUtc(dt.Value, tzi);
            }
        }
    }
}
