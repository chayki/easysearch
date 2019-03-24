using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EasySearch.Models;
using EasySearch.Services;
using System.Net.Http;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using Newtonsoft.Json.Linq;
using System.Net;

namespace EasySearch.Controllers
{
    public class HomeController : Controller
    {
        private readonly IHttpClientFactory _httpClientFactory;

        private readonly IStorageService _storageService;

        
        public HomeController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
            _storageService = new StorageService(_httpClientFactory);
        }

        public IActionResult Index()
        {
            ViewBag.BackgroundImage = "images/homepage_bg.jpg";
            return View();
        }

        [Route("Home")]
        public async Task<IActionResult> Home()
        {
            //var claims = new List<Claim>
            //{
            //    new Claim(ClaimTypes.Name, user.Email),
            //    new Claim("FullName", user.FullName),
            //    new Claim(ClaimTypes.Role, "Administrator"),
            //};
            //var info = _signInManager.GetExternalLoginInfoAsync();
            await AuthenticationHttpContextExtensions.AuthenticateAsync(HttpContext);
            await AuthenticationHttpContextExtensions.SignInAsync(HttpContext, HttpContext.User);
            string accessToken = await HttpContext.GetTokenAsync("access_token");
            var headers = new Dictionary<string, string>();
            var idToken = HttpContext.Request?.Headers["id_token"];
            if(string.IsNullOrEmpty(HttpContext.Request.Cookies["id_token"]))
            {
                return RedirectToAction("Index");
            }
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [Route("CreateFolder")]
        public Boolean CreateFolder()
        {
            var headers = new Dictionary<string, string>();
            var idToken = HttpContext.Request?.Headers["id_token"];
            var handler = new JwtSecurityTokenHandler();
            var tokenS = handler.ReadToken(idToken) as JwtSecurityToken;
            var sub = tokenS.Claims.First(claim => claim.Type == "sub").Value;
            headers.Add(Constants.SubHeader, sub);

            string folderPath = HttpContext.Request.Query["folderName"].ToString();
            Task<Boolean> task = Task.Run(() => _storageService.CreateFolder(
                folderPath,
                headers));
            task.Wait();
            bool isCreationSuccessful = task.Result;
            return isCreationSuccessful;
        }


        [Route("DeleteFolder")]
        public Boolean DeleteFolder()
        {
            var headers = new Dictionary<string, string>();
            var idToken = HttpContext.Request?.Headers["id_token"];
            var handler = new JwtSecurityTokenHandler();
            var tokenS = handler.ReadToken(idToken) as JwtSecurityToken;
            var sub = tokenS.Claims.First(claim => claim.Type == "sub").Value;
            headers.Add(Constants.SubHeader, sub);

            string folderPath = HttpContext.Request.Query["folderPath"].ToString();
            Task<Boolean> task = Task.Run(() => _storageService.DeleteFolder(
                folderPath,
                headers));
            task.Wait();
            bool isCreationSuccessful = task.Result;
            return isCreationSuccessful;
        }

        [Route("UploadImage")]
        public Boolean UploadImage()
        {
            var headers = new Dictionary<string, string>();
            var idToken = HttpContext.Request?.Headers["id_token"];
            var handler = new JwtSecurityTokenHandler();
            var tokenS = handler.ReadToken(idToken) as JwtSecurityToken;
            var sub = tokenS.Claims.First(claim => claim.Type == "sub").Value;
            headers.Add(Constants.SubHeader, sub);

            string targetPath = HttpContext.Request.Query["targetPath"].ToString();
            string imageUrl = HttpContext.Request.Query["url"].ToString();
            string labelsString = HttpContext.Request.Query["labels"].ToString();
            Task<Boolean> task = Task.Run(() => _storageService.UploadImage(
                targetPath,
                imageUrl,
                headers, labelsString));
            task.Wait();
            bool isCreationSuccessful = task.Result;
            return isCreationSuccessful;
        }

        [HttpPost("UploadImageFile")]
        public Boolean UploadImageFile()
        {
            var headers = new Dictionary<string, string>();
            var idToken = HttpContext.Request?.Headers["id_token"];
            var handler = new JwtSecurityTokenHandler();
            var tokenS = handler.ReadToken(idToken) as JwtSecurityToken;
            var sub = tokenS.Claims.First(claim => claim.Type == "sub").Value;
            headers.Add(Constants.SubHeader, sub);
            string jsonData = new StreamReader(HttpContext.Request.Body).ReadToEnd();
            JObject json = JObject.Parse(jsonData);
            string imageContent = json.GetValue("imageContent").ToString();
            string targetPath = json.GetValue("targetPath").ToString();
            List<string> labels = json.GetValue("labels").ToObject<List<string>>();
            Task<Boolean> task = Task.Run(() => _storageService.UploadImageFile(
               targetPath,
               imageContent,
               headers,
               labels));
            task.Wait();
            bool isUploadSuccessful = task.Result;
            return isUploadSuccessful;
        }

        [Route("DeleteImage")]
        public Boolean DeleteImage()
        {
            var headers = new Dictionary<string, string>();
            var idToken = HttpContext.Request?.Headers["id_token"];
            var handler = new JwtSecurityTokenHandler();
            var tokenS = handler.ReadToken(idToken) as JwtSecurityToken;
            var sub = tokenS.Claims.First(claim => claim.Type == "sub").Value;
            headers.Add(Constants.SubHeader, sub);

            string imageAbsolutePath = HttpContext.Request.Query["imageAbsolutePath"].ToString();
            Task<Boolean> task = Task.Run(() => _storageService.DeleteImage(
                imageAbsolutePath,
                headers));
            task.Wait();
            bool isCreationSuccessful = task.Result;
            return isCreationSuccessful;
        }

        [Route("Search")]
        public SearchResult Search(string searchString)
        {
            var headers = new Dictionary<string, string>();
            var idToken = HttpContext.Request?.Headers["id_token"];
            var handler = new JwtSecurityTokenHandler();
            var tokenS = handler.ReadToken(idToken) as JwtSecurityToken;
            var sub = tokenS.Claims.First(claim => claim.Type == "sub").Value;
            headers.Add(Constants.SubHeader, sub);

            string searchQuery = HttpContext.Request.Query["searchQuery"].ToString();
            string folderPath = HttpContext.Request.Query["folderName"].ToString();
            Task<SearchResult> task = Task.Run(() => _storageService.SearchImages(
                folderPath,
                searchQuery,
                headers));
            task.Wait();
            SearchResult directory = task.Result;
            return directory;
        }

        [Route("GetDirectoryItems")]
        public StorageDirectory GetDirectoryItems()
        {
            var headers = new Dictionary<string, string>();
            var idToken = HttpContext.Request?.Headers["id_token"];
            var handler = new JwtSecurityTokenHandler();
            var tokenS = handler.ReadToken(idToken) as JwtSecurityToken;
            var sub = tokenS.Claims.First(claim => claim.Type == "sub").Value;
            headers.Add(Constants.SubHeader, sub);

            string folderPath = HttpContext.Request.Query["folderName"].ToString();
            
            Task<StorageDirectory> task = Task.Run(() => _storageService.GetDirectoryItems(
                folderPath,
                headers));
            task.Wait();
            StorageDirectory directory = task.Result;
            return directory;
        }

        [Route("GetImageLabels")]
        public List<string> GetImageLabels()
        {
            string jsonData = new StreamReader(HttpContext.Request.Body).ReadToEnd();
            JObject json = JObject.Parse(jsonData);
            string imageContent = json.GetValue("imageContent").ToString();
            string imageUrl = json.GetValue("imageUrl").ToString();

            if(!string.IsNullOrEmpty(imageUrl))
            {
                using (var webClient = new WebClient())
                {
                    byte[] imageBytes = webClient.DownloadData(imageUrl);
                    
                    //imageContent = System.Text.Encoding.Default.GetString(imageBytes,0,imageBytes.Length);
                    imageContent = "data:image/jpg;base64," + Convert.ToBase64String(imageBytes, 0, imageBytes.Length);
                }
            }
            Task<List<string>> task = Task.Run(() => _storageService.GetImageLabels(
                imageContent));
            task.Wait();
            return task.Result;
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
