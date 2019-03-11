using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Protocols;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace EasySearch
{
    public class ApplicationConfig
    {
        public static string GetConfigVariable(string key)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("config.json", optional: true, reloadOnChange: true)
                .Build();
            return config.GetValue<string>(key);
        }
    }
}
