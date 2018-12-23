using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmilyEMRVS;
using EmilyEMRVS.Models;
using Microsoft.AspNetCore.Authorization;

namespace EmilyEMRVS.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SpecialsController : ControllerBase
    {
        private readonly DataContext _context;

        public SpecialsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Specials
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Special>>> GetSpecials()
        {
            return await _context.Specials.
                            Include(s => s.products).
                            Include(s => s.services).
                            Include(s => s.specialTaxes).ToListAsync();
        }

        // GET: api/Specials/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetSpecial([FromRoute] int id)
        {
            var special = await _context.Specials.
                            Include(s => s.products).
                            Include(s => s.services).
                            Include(s => s.specialTaxes).Where(s => s.SpecialId == id).FirstOrDefaultAsync();

            return Ok(special);
        }

        // PUT: api/Specials/5
        [HttpPut("{id}")]
        public async Task<ActionResult> PutSpecial([FromRoute] int id, [FromBody] Special special)
        {
            if (id != special.SpecialId)
            {
                return Ok(null);
            }

            var dbSpecial = await _context.Specials
                .Include(e => e.products)
                .Include(e => e.services)
                .Include(e => e.specialTaxes)
                .FirstAsync(s => s.SpecialId == special.SpecialId);

            foreach (var specialProduct in special.products.ToList())
            {
                if (dbSpecial.products.Count(p => p.ProductId == specialProduct.ProductId) == 0)
                {
                    dbSpecial.products.Add(specialProduct);
                }
            }
            foreach (var specialProduct in dbSpecial.products.ToList())
            {
                if (special.products.Count(p => p.ProductId == specialProduct.ProductId) == 0)
                {
                    dbSpecial.products.Remove(specialProduct);
                }
            }
            foreach (var item in special.specialTaxes.ToList())
            {
                if (dbSpecial.specialTaxes.Count(p => p.TaxId == item.TaxId) == 0)
                {
                    dbSpecial.specialTaxes.Add(new SpecialTax { SpecialId = item.SpecialId, TaxId = item.TaxId });
                }
            }
            foreach (var item in dbSpecial.specialTaxes.ToList())
            {
                if (special.specialTaxes.Count(s => s.TaxId == item.TaxId) == 0)
                {
                    dbSpecial.specialTaxes.Remove(item);
                }
            }

            // if this doesn't work, try automapper Package properties -> dbPackage properties
            dbSpecial.name = special.name;
            dbSpecial.totalOfIndividualPrices = special.totalOfIndividualPrices;
            dbSpecial.retailPrice = special.retailPrice;
            dbSpecial.code = special.code;
            dbSpecial.products = special.products;
            dbSpecial.services = special.services;
            dbSpecial.specialTaxes = special.specialTaxes;

            foreach (var item in dbSpecial.products)
            {
                item.Product = null;
            }

            foreach (var item in dbSpecial.specialTaxes)
            {
                item.Tax = null;
            }

            _context.Specials.Update(dbSpecial);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SpecialExists(id))
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

        // POST: api/Specials
        [HttpPost]
        public async Task<ActionResult> PostSpecial([FromBody] Special special)
        {
            _context.Specials.Add(special);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSpecial", new { id = special.SpecialId }, special);
        }

        // DELETE: api/Specials/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSpecial([FromRoute] int id)
        {
            var special = await _context.Specials.FindAsync(id);
            if (special == null)
            {
                return Ok(null);
            }

            _context.Specials.Remove(special);
            await _context.SaveChangesAsync();

            return Ok(special);
        }

        // add product to special
        // remove product from special

        private bool SpecialExists(int id)
        {
            return _context.Specials.Any(e => e.SpecialId == id);
        }

        // GET: api/Specials/new
        [HttpGet("new")]
        public async Task<ActionResult> GetListsForNewSpecial()
        {
            var dto = new GetListsForNewSpecialDTO
            {
                Products = await _context.Products.ToListAsync(),
                Services = await _context.Services.ToListAsync(),
                Taxes = await _context.Taxes.ToListAsync()
            };

            return Ok(dto);
        }

        private class GetListsForNewSpecialDTO
        {
            public ICollection<Product> Products { get; set; }
            public ICollection<Service> Services { get; set; }
            public ICollection<Tax> Taxes { get; set; }
        }

        // GET: api/Specials/5/edit
        [HttpGet("{id}/edit")]
        public async Task<ActionResult> GetSpecialForEdit([FromRoute] int id)
        {
            var list = _context.Specials
                .Include(e => e.products) //.ThenInclude(e => e.Product)
                .Include(e => e.services) //.ThenInclude(e => e.Service)
                .Include(e => e.specialTaxes).ThenInclude(e => e.Tax);

            var item = await list.FirstOrDefaultAsync(e => e.SpecialId == id);

            var dto = new GetSpecialForEditDTO
            {
                Special = item,
                Products = await _context.Products.ToListAsync(),
                Services = await _context.Services.ToListAsync(),
                Taxes = await _context.Taxes.ToListAsync()
            };

            return Ok(dto);
        }

        private class GetSpecialForEditDTO
        {
            public Special Special { get; set; }
            public ICollection<Product> Products { get; set; }
            public ICollection<Service> Services { get; set; }
            public ICollection<Tax> Taxes { get; set; }
        }
    }
}