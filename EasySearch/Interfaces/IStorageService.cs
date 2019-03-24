using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EasySearch
{
    public interface IStorageService
    {
        Task<Boolean> CreateFolder(
            string folderPath,
            IDictionary<string,string> requestHeaders);
        Task<Boolean> DeleteFolder(
            string folderPath,
            IDictionary<string, string> requestHeaders);
        Task<Boolean> UploadImage(
            string targetPath,
            string url,
            IDictionary<string, string> requestHeaders, string labelsString);
        Task<Boolean> UploadImageFile(
            string targetPath,
            string imageContent,
            IDictionary<string, string> requestHeaders,
            List<string> labels);
        Task<Boolean> DeleteImage(
            string imageAbsolutePath,
            IDictionary<string, string> requestHeaders);
        Task<StorageDirectory> GetDirectoryItems(
            string folderPath,
            IDictionary<string, string> requestHeaders);

        Task<SearchResult> SearchImages(
            string folderPath,
            string searchQuery,
            IDictionary<string,string> requestHeaders);

        Task<List<string>> GetImageLabels(string imageContent);
    }
}
