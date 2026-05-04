using Supabase;
using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.AspNetCore.Mvc;
using Postgrest.Attributes;
using Postgrest.Models;

var builder = WebApplication.CreateBuilder(args);

// CORS for the frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

// Initialize Supabase Client
// Note: You must provide these in appsettings.json
var supabaseUrl = builder.Configuration["Supabase:Url"] ?? "https://your-project.supabase.co";
var supabaseKey = builder.Configuration["Supabase:Key"] ?? "your-anon-key";
var supabaseOptions = new Supabase.SupabaseOptions
{
    AutoRefreshToken = true,
    AutoConnectRealtime = true
};

builder.Services.AddSingleton(_ => new Supabase.Client(supabaseUrl, supabaseKey, supabaseOptions));

var app = builder.Build();

app.UseCors("AllowAll");

// --- 🔐 AUTH ENDPOINTS ---

app.MapPost("/auth/register", async (RegisterRequest req, Supabase.Client client) =>
{
    try
    {
        var session = await client.Auth.SignUp(req.Email, req.Password);
        return Results.Ok(new { Message = "Registration successful! Check your email for confirmation.", User = session.User });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { Error = ex.Message });
    }
});

app.MapPost("/auth/login", async (LoginRequest req, Supabase.Client client) =>
{
    try
    {
        var session = await client.Auth.SignIn(req.Email, req.Password);
        return Results.Ok(new { Message = "Login successful", Session = session });
    }
    catch (Exception ex)
    {
        return Results.Unauthorized();
    }
});

app.MapPost("/auth/logout", async (Supabase.Client client) =>
{
    try 
    {
        await client.Auth.SignOut();
        return Results.Ok(new { Message = "Logged out successfully" });
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

// --- 📦 CRUD ENDPOINTS FOR PRODUCTS ---

app.MapGet("/api/products", async (Supabase.Client? client) =>
{
    try 
    {
        if (client != null)
        {
             var response = await client.From<Product>().Get();
             if (response.Models != null && response.Models.Any()) 
             {
                 var dtos = response.Models.Select(p => new ProductDto(p.Id, p.Name, p.Price, p.Description, p.ImageUrl));
                 return Results.Ok(dtos);
             }
        }
    }
    catch { /* fallback */ }

    // Hardcoded fallback products
    var fallbackProducts = new List<ProductDto> {
        new ProductDto(1, "Premium California Almonds", 499, "Rich in protein and healthy fats.", "images/premium almonds.jpeg"),
        new ProductDto(2, "Premium Cashew Nuts", 699, "Sweet and creamy cashews.", "images/cashew nuts.png"),
        new ProductDto(3, "Premium Walnut Kernels", 599, "High quality walnut kernels.", "images/premium walnut kernels.png"),
        new ProductDto(4, "Royal Dry Fruit Mixture", 799, "Mixed premium nuts and seeds.", "images/dry fruit mix.png")
    };
    return Results.Ok(fallbackProducts);
});

app.MapPost("/api/products", async (Product product, Supabase.Client client) =>
{
    try
    {
        var response = await client.From<Product>().Insert(product);
        return Results.Created($"/api/products/{response.Model.Id}", response.Model);
    }
    catch (Exception ex)
    {
        return Results.BadRequest(ex.Message);
    }
});

app.MapPut("/api/products/{id}", async (int id, Product product, Supabase.Client client) =>
{
    try
    {
        product.Id = id;
        var response = await client.From<Product>().Update(product);
        return Results.Ok(response.Model);
    }
    catch (Exception ex)
    {
        return Results.BadRequest(ex.Message);
    }
});

app.MapDelete("/api/products/{id}", async (int id, Supabase.Client client) =>
{
    try
    {
        await client.From<Product>().Where(x => x.Id == id).Delete();
        return Results.NoContent();
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

// --- 🛒 ORDER ENDPOINT (WITH EMAIL RECEIPT) ---

app.MapPost("/api/orders", async (OrderRequest order, IConfiguration config) =>
{
    if (string.IsNullOrEmpty(order.CustomerEmail) || order.Items == null || order.Items.Count == 0)
    {
        return Results.BadRequest("Invalid order data.");
    }

    var orderId = Guid.NewGuid().ToString()[..8].ToUpper();
    var totalAmount = order.Items.Sum(i => i.Price * i.Quantity);
    
    var receiptBody = $@"
        <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;'>
            <h1 style='color: #2d5f3f;'>Noble Dryfruits</h1>
            <h2>Order Confirmation #{orderId}</h2>
            <p>Thank you for your order, {order.CustomerName}!</p>
            <table style='width: 100%; border-collapse: collapse;'>
                <tr style='background: #f4f4f4;'>
                    <th style='padding: 10px; text-align: left;'>Item</th>
                    <th style='padding: 10px;'>Price</th>
                    <th style='padding: 10px;'>Qty</th>
                </tr>";

    foreach (var item in order.Items)
    {
        receiptBody += $"<tr><td style='padding:10px;'>{item.ProductName}</td><td style='text-align:center;'>₹{item.Price}</td><td style='text-align:center;'>{item.Quantity}</td></tr>";
    }

    receiptBody += $@"
            </table>
            <div style='margin-top: 20px; text-align: right;'>
                <p>Subtotal: ₹{totalAmount}</p>
                <p>Tax (5%): ₹{order.Tax}</p>
                <p>Delivery Fee: {(order.DeliveryFee == 0 ? "Free" : "₹" + order.DeliveryFee)}</p>
                <h3 style='color: #2d5f3f;'>Total: ₹{order.FinalTotal}</h3>
            </div>
            <div style='margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;'>
                <h4>Shipping to:</h4>
                <p>{order.ShippingAddress}</p>
            </div>
        </div>";

    try
    {
        var smtpHost = config["Smtp:Host"];
        var smtpPort = int.Parse(config["Smtp:Port"] ?? "587");
        var smtpUser = config["Smtp:User"];
        var smtpPass = config["Smtp:Pass"];

        if (!string.IsNullOrEmpty(smtpUser) && !smtpUser.Contains("YOUR_EMAIL"))
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Noble Dryfruits", smtpUser));
            message.To.Add(new MailboxAddress(order.CustomerName, order.CustomerEmail));
            message.Subject = $"Order Confirmation #{orderId}";
            message.Body = new BodyBuilder { HtmlBody = receiptBody }.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(smtpHost, smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(smtpUser, smtpPass);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }

        return Results.Ok(new { Message = "Order placed successfully", OrderId = orderId });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Order created but email failed: {ex.Message}");
    }
});

app.MapPost("/api/contact", async (ContactRequest req) => {
    // Basic logic to simulate contact form processing
    Console.WriteLine($"Received inquiry from {req.Name} ({req.Email}): {req.Message}");
    return Results.Ok(new { Message = "Thank you for contacting us! We will get back to you soon." });
});

app.Run();

// --- 🗃️ DATA MODELS ---

[Table("products")]
public class Product : BaseModel
{
    [PrimaryKey("id", false)]
    public int Id { get; set; }

    [Column("name")]
    public string Name { get; set; }

    [Column("price")]
    public decimal Price { get; set; }

    [Column("description")]
    public string Description { get; set; }

    [Column("image_url")]
    public string ImageUrl { get; set; }
}

public record ProductDto(int Id, string Name, decimal Price, string Description, string ImageUrl);
public record LoginRequest(string Email, string Password);
public record RegisterRequest(string Email, string Password);
public record OrderItem(string ProductName, decimal Price, int Quantity);
public record OrderRequest(string CustomerName, string CustomerEmail, string ShippingAddress, List<OrderItem> Items, decimal Tax, decimal DeliveryFee, decimal FinalTotal);
public record ContactRequest(string Name, string Email, string Subject, string Message);
