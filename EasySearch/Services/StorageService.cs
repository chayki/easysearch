using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace EasySearch.Services
{
    public class StorageService : IStorageService
    {
        private readonly IHttpClientFactory _clientFactory;

        public bool CreateFolderError { get; private set; }

        public StorageService(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }

        public async Task<Boolean> CreateFolder(
            string folderPath,
            IDictionary<string,string> requestHeaders)
        {
            var requestUri = string.Format(
                "storage/createFolder?folderName={0}&userName={1}",
                folderPath,
                requestHeaders[Constants.SubHeader]);
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                requestUri);
            foreach(KeyValuePair<string,string> keyValuePair in requestHeaders)
            {
                request.Headers.Add(keyValuePair.Key, keyValuePair.Value);
            }

            var client = _clientFactory.CreateClient("storageservice");
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public Boolean UploadToIndex(string userId, string path, string documentId, string url)
        {
            var requestUri = "index/AddDocument";
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                requestUri);
            Dictionary<string, string> postData = new Dictionary<string, string>()
            {
                {"docId",documentId },
                {"documentPath", path },
                {"documentURL", url },
                {"userId", userId }
            };

            request.Content = new FormUrlEncodedContent(postData);
            var client = _clientFactory.CreateClient("storageservice");
            var response =  client.SendAsync(request);
            var contents = response.Result.Content.ReadAsStringAsync().Result;
            JObject json = JObject.Parse(contents);
            Boolean isSuccessful = json["status"].ToObject<Boolean>(); ;
            return isSuccessful;
        }

        public async Task<Boolean> DeleteFolder(
            string folderPath,
            IDictionary<string, string> requestHeaders)
        {
            var requestUri = string.Format(
                "storage/deleteFolder?url={0}&userName={1}",
                folderPath,
                requestHeaders[Constants.SubHeader]);
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                requestUri);
            foreach (KeyValuePair<string, string> keyValuePair in requestHeaders)
            {
                request.Headers.Add(keyValuePair.Key, keyValuePair.Value);
            }

            var client = _clientFactory.CreateClient("storageservice");
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<Boolean> UploadImage(
            string targetPath,
            string url,
            IDictionary<string, string> requestHeaders)
        {
            var requestUri = string.Format("storage/uploadImage?url={0}&targetPath={1}&userName={2}",
                url,
                targetPath,
                requestHeaders[Constants.SubHeader]);
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                requestUri);
            foreach (KeyValuePair<string, string> keyValuePair in requestHeaders)
            {
                request.Headers.Add(keyValuePair.Key, keyValuePair.Value);
            }

            var client = _clientFactory.CreateClient("storageservice");
            var response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<Boolean> DeleteImage(
            string imageAbsolutePath,
            IDictionary<string, string> requestHeaders)
        {
            var requestUri = string.Format(
                "storage/deleteImage?url={0}&userName={1}",
                imageAbsolutePath,
                requestHeaders[Constants.SubHeader]);
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                requestUri);
            foreach (KeyValuePair<string, string> keyValuePair in requestHeaders)
            {
                request.Headers.Add(keyValuePair.Key, keyValuePair.Value);
            }

            var client = _clientFactory.CreateClient("storageservice");
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<StorageDirectory> GetDirectoryItems(
            string folderPath,
            IDictionary<string, string> requestHeaders)
        {
            //var requestUri = string.Format("storage/downloadObjects?url={0}", folderPath);
            //var request = new HttpRequestMessage(
            //    HttpMethod.Get,
            //    requestUri);
            //var client = _clientFactory.CreateClient("storageservice");
            //var response = await client.SendAsync(request);

            var requestUri = string.Format("storage/downloadObjects?path={0}&userName={1}",
                folderPath,
                requestHeaders[Constants.SubHeader]);
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                requestUri);
            foreach (KeyValuePair<string, string> keyValuePair in requestHeaders)
            {
                request.Headers.Add(keyValuePair.Key, keyValuePair.Value);
            }

            var client = _clientFactory.CreateClient("storageservice");
            var response = await client.SendAsync(request);
            StorageDirectory directory = new StorageDirectory();
            if (response.IsSuccessStatusCode)
            {
                JObject content = JObject.Parse(response.Content.ReadAsStringAsync().Result);
                directory.FolderNames = content["directories"].ToObject<List<string>>();
                directory.files = content["files"].ToObject<List<Dictionary<string,Uri>>>();
            }
            else
            {
                CreateFolderError = false;
                directory.FolderNames = new List<string>();
                directory.files = new List<Dictionary<string,Uri>>();
            }
            return directory;
        }

        public async Task<SearchResult> SearchImages(
            string folderPath,
            string searchQuery,
            IDictionary<string, string> requestHeaders)
        {
            var requestUri = string.Format("storage/SearchImages?userId={0}&path={1}&searchString={2}",
                 requestHeaders[Constants.SubHeader],
                 folderPath,
                 searchQuery);
            var request = new HttpRequestMessage(
                HttpMethod.Get,
                requestUri);
            foreach (KeyValuePair<string, string> keyValuePair in requestHeaders)
            {
                request.Headers.Add(keyValuePair.Key, keyValuePair.Value);
            }

            var client = _clientFactory.CreateClient("storageservice");
            var response = await client.SendAsync(request);
            SearchResult searchResult = new SearchResult();
            if (response.IsSuccessStatusCode)
            {
                JArray imageEntities = JArray.Parse(response.Content.ReadAsStringAsync().Result);
                List<Dictionary<string, string>> files = new List<Dictionary<string, string>>();
                if (imageEntities.Count > 0)
                {
                    foreach(JObject imageEntity in imageEntities.Children<JObject>())
                    {
                        Dictionary<string, string> file = new Dictionary<string, string>();
                        file.Add("name", imageEntity.GetValue("path").ToString() + imageEntity.GetValue("imageId").ToString());
                        file.Add("path", imageEntity.GetValue("imageUrl").ToString());
                        files.Add(file);
                    }
                }
                searchResult.files = files;
            }
            return searchResult;
        }
    }
}
