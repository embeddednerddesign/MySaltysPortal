﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmilyEMRVS
{
    public class DataInitializer
    {
        DataContext context;
        public DataInitializer(DataContext context)
        {
            this.context = context;
        }
    }
}
