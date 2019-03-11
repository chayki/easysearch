using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Identity;
using Microsoft.Owin.Security.Google;
using Microsoft.AspNetCore.Authentication.Cookies;
using Google;
using System.Security.Claims;
using EasySearch.Services;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;

namespace EasySearch
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });
            
            

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddGoogle("Google", options =>
                {
                    options.ClientId = "443877573989-c22o4hakfogbgr6gkpb8f35hsmrks6od.apps.googleusercontent.com";
                    options.ClientSecret = "JxJ0mGxnRqzd6L1z3hohLUce";
                    options.UserInformationEndpoint = "https://www.googleapis.com/oauth2/v2/userinfo";
                    options.TokenEndpoint = "https://accounts.google.com/o/oauth2/token";
                    options.ClaimActions.Clear();
                    options.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "id");
                    options.ClaimActions.MapJsonKey(ClaimTypes.Name, "name");
                    options.ClaimActions.MapJsonKey(ClaimTypes.GivenName, "given_name");
                    options.ClaimActions.MapJsonKey(ClaimTypes.Surname, "family_name");
                    options.ClaimActions.MapJsonKey("urn:google:profile", "link");
                    options.ClaimActions.MapJsonKey(ClaimTypes.Email, "email");
                    options.ClaimActions.MapJsonKey("urn:google:uniqueId", "sub");
                    options.ClaimActions.MapJsonKey("id_token", "id_token");
                    options.SaveTokens = true;
                    options.Events.OnCreatingTicket = ctx =>
                    {
                        List<AuthenticationToken> tokens = ctx.Properties.GetTokens()
                            as List<AuthenticationToken>;
                        tokens.Add(new AuthenticationToken()
                        {
                            Name = "TicketCreated",
                            Value = DateTime.UtcNow.ToString()
                        });
                        ctx.Properties.StoreTokens(tokens);
                        return Task.CompletedTask;
                    };
                })
                .AddCookie()
                //.AddOpenIdConnect("oidc", options =>
                //{
                //    options.ClientId = "443877573989-c22o4hakfogbgr6gkpb8f35hsmrks6od.apps.googleusercontent.com";
                //    options.ClientSecret = "JxJ0mGxnRqzd6L1z3hohLUce";
                //    options.GetClaimsFromUserInfoEndpoint = true;
                //    options.ResponseType = OpenIdConnectResponseType.CodeIdToken; ;
                //    options.Authority = "https://accounts.google.com";
                //    options.Scope.Add("api1");
                //    options.Scope.Add("offline_access");
                //    options.SaveTokens = true;
                //    options.ClaimActions.MapJsonKey("Contacts", "Contacts");
                //})
                ;

            services.AddScoped<IStorageService, StorageService>();
            //services.AddScoped<SignInManager<IdentityUser>, SignInManager<IdentityUser>>();
            //services.AddScoped<UserManager<IdentityUser>, UserManager<IdentityUser>>();
            //services.AddScoped<IUserStore<IdentityUser>, UserStore<IdentityUser>>();

            services.AddHttpClient("storageservice", c =>
            {
                c.BaseAddress = new Uri("https://imagesearch-230917.appspot.com/");
            });

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        }

        //public void ConfigureAuth(IApplicationBuilder app)
        //{

        //    var authenticationOptions = new GoogleOAuth2AuthenticationOptions()
        //    {
        //        ClientId =     ApplicationConfig.GetConfigVariable("GoogleCloudSamples:AuthClientId"),
        //        ClientSecret = ApplicationConfig.GetConfigVariable("GoogleCloudSamples:AuthClientSecret"),
        //    };

            
        //}

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();
            app.UseCookiePolicy();


            app.UseAuthentication();

            app.UseMvcWithDefaultRoute();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapRoute(
                   name: "Home",
                   template: "Home",
                   defaults: new { controller = "Home", action = "Home" });
                //routes.MapRoute(
                //    name: "session",
                //    template: "{controller=Session}/{action=Login}"
                //    //defaults: new { controller = "Session", action = "Login" }
                //    );
            });
        }
    }
}
