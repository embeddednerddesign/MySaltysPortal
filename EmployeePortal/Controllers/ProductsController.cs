using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeePortal;
using EmployeePortal.Models;
using Microsoft.AspNetCore.Authorization;

namespace EmployeePortal.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly DataContext _context;

        public ProductsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            List<Product> theprods = new List<Product>();
            theprods = await _context.Products
                        .Include(p => p.category)
                        .Include(p => p.productTaxes).ThenInclude(pt => pt.Tax)
                        .Include(p => p.visitProducts)
                        .ToListAsync();
            return theprods;
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetProduct([FromRoute] int id)
        {
            var product = await _context.Products
                            .Include(p => p.category)
                            .Include(p => p.productTaxes).ThenInclude(pt => pt.Tax)
                            .Include(p => p.visitProducts)
                            .FirstAsync(p => p.ProductId == id);

            return Ok(product);
        }

        // GET: api/Products/Category/5
        [HttpGet("Category/{id}")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProductsByCategory([FromRoute] int id)
        {
            var service = await _context.Products
                            .Include(p => p.category)
                            .Include(p => p.productTaxes).ThenInclude(pt => pt.Tax)
                            .Include(p => p.visitProducts)
                            .Where(p => p.productCategoryId == id).ToListAsync();

            return Ok(service);
        }

        // PUT: api/Products/5
        [HttpPut("{id}")]
        public async Task<ActionResult> PutProduct([FromRoute] int id, [FromBody] Product product)
        {
            if (id != product.ProductId)
            {
                return Ok(null);
            }

            var dbEntity = await _context.Products
                .Include(e => e.productTaxes)
                .FirstAsync(e => e.ProductId == id);

            foreach (var item in product.productTaxes.ToList())
            {
                if (dbEntity.productTaxes.Count(p => p.TaxId == item.TaxId) == 0)
                {
                    dbEntity.productTaxes.Add(new ProductTax { ProductId = item.ProductId, TaxId = item.TaxId });
                }
            }
            foreach (var item in dbEntity.productTaxes.ToList())
            {
                if (product.productTaxes.Count(p => p.TaxId == item.TaxId) == 0)
                {
                    dbEntity.productTaxes.Remove(item);
                }
            }

            dbEntity.name = product.name;
            dbEntity.productCode = product.productCode;
            dbEntity.quantityInStock = product.quantityInStock;
            dbEntity.retailPrice = product.retailPrice;
            dbEntity.wholesalePrice = product.wholesalePrice;
            dbEntity.quantity = product.quantity;
            dbEntity.usageDuration = product.usageDuration;
            dbEntity.productCategoryId = product.productCategoryId;

            foreach (var item in dbEntity.productTaxes)
            {
                item.Tax = null;
            }

            _context.Products.Update(dbEntity);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Products
        [HttpPost]
        public async Task<ActionResult> PostProduct([FromBody] Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProduct", new { id = product.ProductId }, product);
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct([FromRoute] int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return Ok(null);
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(product);
        }

        [HttpGet("Company/{id}")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProductsByCompany([FromRoute] int id)
        {
            return await _context.Products.ToListAsync();
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.ProductId == id);
        }

        // GET: api/Products/new
        [HttpGet("new")]
        public async Task<ActionResult> GetListsForNewProduct()
        {
            var dto = new GetListsForNewProductDTO
            {
                ProductCategories = await _context.ProductCategories.ToListAsync(),
                Taxes = await _context.Taxes.ToListAsync()
            };

            return Ok(dto);
        }

        private class GetListsForNewProductDTO
        {
            public ICollection<ProductCategory> ProductCategories { get; set; }
            public ICollection<Tax> Taxes { get; set; }
        }

        // GET: api/Products/5/edit
        [HttpGet("{id}/edit")]
        public async Task<ActionResult> GetProductForEdit([FromRoute] int id)
        {
            var list = _context.Products
                .Include(e => e.category)
                .Include(e => e.productTaxes).ThenInclude(e => e.Tax);

            var item = await list.FirstOrDefaultAsync(e => e.ProductId == id);

            var dto = new GetProductForEditDTO
            {
                Product = item,
                ProductCategories = await _context.ProductCategories.ToListAsync(),
                Taxes = await _context.Taxes.ToListAsync()
            };

            return Ok(dto);
        }

        private class GetProductForEditDTO
        {
            public Product Product { get; set; }
            public ICollection<ProductCategory> ProductCategories { get; set; }
            public ICollection<Tax> Taxes { get; set; }
        }
    }
}