using System;
using System.Collections.Generic;

namespace EasySearch
{
    public class StorageDirectory
    {
        public List<string> FolderNames {get; set;}

        public List<Dictionary<string,Uri>> files { get; set; }
    }
}
