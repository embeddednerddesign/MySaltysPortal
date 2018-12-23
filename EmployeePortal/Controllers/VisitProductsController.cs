using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EmilyEMRVS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmilyEMRVS.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class VisitProductsController : ControllerBase
    {
        private readonly DataContext _context;

        public VisitProductsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/VisitProducts
        [HttpGet("{id}", Name = "Get")]
        public async Task<ActionResult<VisitProduct>> Get(int id)
        {
            return await _context.VisitProducts.FindAsync(id);
        }

        // GET: api/VisitProducts/5
        [HttpGet("GetByVisitId/{id}")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProductsByVisitId (int id)
        {
            var visitProducts = await _context.VisitProducts.Where(vp => vp.VisitId == id).ToListAsync();
            var products = new List<Product>();
            foreach (var visitProduct in visitProducts)
            {
                var productToAdd = await _context.Products
                                    .Include(p => p.productTaxes).ThenInclude(pt => pt.Tax)
                                    .FirstOrDefaultAsync(p => p.ProductId == visitProduct.ProductId);
                productToAdd.quantity = visitProduct.Quantity;
                products.Add(productToAdd);
            }
            return Ok(products);
        }

        // POST: api/VisitProducts
        [HttpPost]
        public async Task<ActionResult<VisitProduct>> Post([FromBody] VisitProduct visitProduct)
        {
            _context.VisitProducts.Add(visitProduct);
            await _context.SaveChangesAsync();
            return CreatedAtAction("Get", new { id = visitProduct.Id }, visitProduct);
        }

        // PUT: api/VisitProducts/5
        [HttpPut]
        public async Task<ActionResult<VisitProduct>> Put([FromBody] VisitProduct visitProduct)
        {
            var visitProductToUpdate = await _context.VisitProducts.FirstOrDefaultAsync(vp => vp.VisitId == visitProduct.VisitId && vp.ProductId == visitProduct.ProductId);
            if (!object.Equals(visitProductToUpdate, default(VisitProduct)))
            {
                visitProductToUpdate.Quantity = visitProduct.Quantity;
                _context.VisitProducts.Update(visitProductToUpdate);
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    return NotFound();
                }
                var product = _context.Products.FirstOrDefaultAsync(p => p.ProductId == visitProductToUpdate.ProductId).Result;
                product.quantity = visitProduct.Quantity;
                return Ok(product);
            } else
            {
                return NotFound();
            }
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{visitId}/{productId}")]
        public async Task<ActionResult<VisitProduct>> Delete(int visitId, int productId)
        {
            var visitProduct = await _context.VisitProducts.Where(vp => vp.VisitId == visitId && vp.ProductId == productId).FirstOrDefaultAsync();
            _context.VisitProducts.Remove(visitProduct);
            await _context.SaveChangesAsync();
            return Ok(visitProduct);
        }
    }
}
