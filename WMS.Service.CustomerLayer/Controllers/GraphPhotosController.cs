using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Client;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace WMS.Service.CustomerLayer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GraphPhotosController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<GraphPhotosController> _logger;

        public GraphPhotosController(IConfiguration configuration, IHttpClientFactory httpClientFactory, ILogger<GraphPhotosController> logger)
        {
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        // Recibir la búsqueda
        public class PhotoSearchRequest
        {
            public List<string> Keywords { get; set; }
        }

        // Deserializar la respuesta de Graph
        public class GraphSearchResponse
        {
            public List<GraphPhotoItem> value { get; set; }
        }

        public class GraphPhotoItem
        {
            public string id { get; set; }
            public string name { get; set; }
        }

        public class GraphPhotoDetails
        {
            public string id { get; set; }
            public string name { get; set; }
            [JsonProperty("@microsoft.graph.downloadUrl")]
            public string DownloadUrl { get; set; }
        }

        [HttpPost("GetGraphPhotos")]
        public async Task<IActionResult> GetGraphPhotos([FromBody] PhotoSearchRequest request)
        {
            try
            {
                var tenantId = _configuration["AzureAd:TenantId"];
                var clientId = _configuration["AzureAd:ClientId"];
                var clientSecret = _configuration["AzureAd:ClientSecret"];
                var authority = $"https://login.microsoftonline.com/{tenantId}";
                string[] scopes = new[] { "https://graph.microsoft.com/.default" };

                IConfidentialClientApplication app = ConfidentialClientApplicationBuilder.Create(clientId)
                    .WithClientSecret(clientSecret)
                    .WithAuthority(authority)
                    .Build();

                var authResult = await app.AcquireTokenForClient(scopes).ExecuteAsync();
                string accessToken = authResult.AccessToken;

                var httpClient = _httpClientFactory.CreateClient();
                httpClient.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", accessToken);

                var aggregatedPhotos = new List<GraphPhotoDetails>();

                foreach (var keyword in request.Keywords)
                {
                    string searchUrl = $"https://graph.microsoft.com/v1.0/users/e0aa464b-fa46-49b5-9918-08aa057744b0/drive/root/search(q='{Uri.EscapeDataString(keyword)}')?$select=name,id";
                    var searchResponse = await httpClient.GetAsync(searchUrl);

                    if (!searchResponse.IsSuccessStatusCode)
                    {
                        var errorContent = await searchResponse.Content.ReadAsStringAsync();
                        _logger.LogError($"Error buscando {keyword}: {searchResponse.StatusCode} - {errorContent}");
                        break;
                    }

                    var searchContent = await searchResponse.Content.ReadAsStringAsync();
                    var searchResult = JsonConvert.DeserializeObject<GraphSearchResponse>(searchContent);

                    if (searchResult?.value != null && searchResult.value.Any())
                    {
                        var exactMatches = searchResult.value
                            .Where(item => string.Equals(item.name, keyword, StringComparison.OrdinalIgnoreCase))
                            .ToList();

                        if (exactMatches.Any())
                        {
                            var photoItem = exactMatches.First();
                            if (!aggregatedPhotos.Any(x => x.id == photoItem.id))
                            {
                                string detailUrl = $"https://graph.microsoft.com/v1.0/users/e0aa464b-fa46-49b5-9918-08aa057744b0/drive/items/{photoItem.id}";
                                var detailResponse = await httpClient.GetAsync(detailUrl);

                                if (detailResponse.IsSuccessStatusCode)
                                {
                                    var detailContent = await detailResponse.Content.ReadAsStringAsync();
                                    var photoDetails = JsonConvert.DeserializeObject<GraphPhotoDetails>(detailContent);
                                    if (photoDetails != null)
                                    {
                                        aggregatedPhotos.Add(photoDetails);
                                    }
                                }
                            }
                        }
                    }
                }
                return Ok(aggregatedPhotos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en GetGraphPhotos");
                return StatusCode(500, new { success = false, message = $"Error: {ex.Message}" });
            }
        }
    }
}
