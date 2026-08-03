export const domainYaml = `project:
  name: MyShop
  database: postgresql

auth:
  type: jwt
  entity: User

entities:
  Product:
    features: [audit, soft_delete]
    fields:
      id: uuid [primary]
      title: string [required, min:3, max:200]
      price: decimal [required, gte:0]
      categoryId: relation(Category) [optional, on_delete:set_null]
    permissions:
      read: ["*"]
      create: [Admin]
      update: ["@Owner", Admin]
      delete: [Admin]
    seed:
      - { title: "Bluetooth Speaker", price: "49.99" }

  Category:
    fields:
      id: uuid [primary]
      name: string [required, unique]
      products: relation(Product) [many]
`;

export const generatedService = `// src/Application/Generated/ProductService.g.cs
public partial class ProductService
{
    private readonly IProductRepository _repo;

    public ProductService(IProductRepository repo)
        => _repo = repo;

    public async Task<ProductDto> GetByIdAsync(Guid id)
    {
        var entity = await _repo.GetByIdAsync(id);
        return ToDto(entity);
    }

    public async Task CreateAsync(UpsertProductCommand cmd)
    {
        var entity = new Product { Title = cmd.Title, Price = cmd.Price };
        await _repo.AddAsync(entity);
        OnBeforeCreate(entity);
        await _repo.SaveChangesAsync();
        OnAfterCreate(entity);
    }

    partial void OnBeforeCreate(Product entity);
    partial void OnAfterCreate(Product entity);
}
`;

export const projectTree = `MyShop/
├── src/
│   ├── Domain/          # entities, enums, DTOs
│   ├── Application/     # services, repos, hooks
│   ├── Infrastructure/  # EF Core, seeders, Dapr
│   └── WebApi/          # controllers, auth, Docker
├── tests/
│   └── ApiTests.cs
├── MyShop.sln
├── Dockerfile
└── docker-compose.yml`;