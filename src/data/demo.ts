export const domainYaml = `project:
  name: MyShop
database: postgresql

auth:
  type: jwt
  entity: User
  roles: [Admin, User]

entities:
  User:
    fields:
      id: uuid [primary]
      email: string [email, unique]
      password: string [hidden]
  Product:
    features: [audit, soft_delete]
    fields:
      id: uuid [primary]
      title: string [required, min:3]
      price: decimal [required, gte:0]
    permissions:
      read: ["*"]
      create: [Admin]`;

export const aiDomainYaml = `entities:
  Product:
    features: [audit, soft_delete]
    fields:
      id: uuid [primary]
      title: string [required, min:3]
      price: decimal [required, gte:0]
      categoryId: relation(Category) [optional]
    permissions:
      read: ["*"]
      create: [Admin]
      update: ["@Owner"]
  Category:
    fields:
      id: uuid [primary]
      name: string [required, unique]`;

export const generatedService = `// src/Application/Services/ProductService.cs — your file
public partial class ProductService
{
    // Runs before a Product is saved. Fail("reason") aborts.
    protected override async Task<HookResult> OnBeforeCreateAsync(
        Product entity, CancellationToken ct)
    {
        if (entity.Price <= 0)
            return HookResult.Fail("Price must be positive");
        return HookResult.Success();
    }
}
`;

export const projectTree = `MyShop/
├── src/
│   ├── Domain/          # entities, enums, DTOs
│   ├── Application/     # services + YOUR hooks
│   ├── Infrastructure/  # EF Core, seeders, Dapr
│   └── WebApi/          # controllers, auth, Docker
├── tests/               # xUnit + Testcontainers PG
├── admin/               # generated admin panel
├── MyShop.sln
└── docker-compose.yml`;
