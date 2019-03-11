using Microsoft.AspNetCore.Authentication;
using System;
using System.Linq;
using System.Web.Http.Owin;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNet.Identity;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace EasySearch.Controllers
{
    public class SessionController : Controller
    {
        // [START login]
        public async void Login()
        {

            // Redirect to the Google OAuth 2.0 user consent screen
            await AuthenticationHttpContextExtensions.ChallengeAsync(
              HttpContext, "Google", new AuthenticationProperties { RedirectUri = "/Home" }
            );
            ClaimsPrincipal cPrincipal = new ClaimsPrincipal();
            await AuthenticationHttpContextExtensions.AuthenticateAsync(HttpContext);
            await AuthenticationHttpContextExtensions.SignInAsync(HttpContext, HttpContext.User);
            //var identity = (ClaimsIdentity)User.Identity;
            
        }
        // [END login]s

        // [START logout]
        public ActionResult Logout()
        {
            HttpContext.SignOutAsync(
                CookieAuthenticationDefaults.AuthenticationScheme, new AuthenticationProperties { RedirectUri = "/" }).Wait();

            return Redirect("/");
        }
        // [END logout]
    }
}
