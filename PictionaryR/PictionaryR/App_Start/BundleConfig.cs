﻿using System.Web;
using System.Web.Optimization;

namespace PictionaryR
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css",
                      "~/Content/chat.css",
                      "~/Content/user-list.css",
                      "~/Content/board.css"));

            bundles.Add(new ScriptBundle("~/bundles/angular-app-controllers").IncludeDirectory(
                    "~/Scripts/app/controllers", "*.js", true));

            bundles.Add(new ScriptBundle("~/bundles/angular-app-directives").IncludeDirectory(
                      "~/Scripts/app/directives", "*.js", true));

            bundles.Add(new ScriptBundle("~/bundles/angular-app-services").IncludeDirectory(
                      "~/Scripts/app/services", "*.js", true));
        }
    }
}
