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
    public class PackagesController : ControllerBase
    {
        private readonly DataContext _context;

        public PackagesController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Packages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Package>>> GetPackages()
        {
            return await _context.Packages.
                            Include(p => p.packageProducts).
                            Include(p => p.packageServices).
                            Include(p => p.packageTaxes).ToListAsync();
        }

        // GET: api/Packages/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetPackage([FromRoute] int id)
        {
            var package = await _context.Packages.
                            Include(p => p.packageProducts).
                            Include(p => p.packageServices).
                            Include(p => p.packageTaxes).Where(p => p.PackageId == id).FirstOrDefaultAsync();

            return Ok(package);
        }

        // PUT: api/Packages/5
        [HttpPut("{id}")]
        public async Task<ActionResult> PutPackage([FromRoute] int id, [FromBody] Package package)
        {
            if (id != package.PackageId)
            {
                return Ok(null);
            }

            var dbPackage = await _context.Packages
                .Include(e => e.packageProducts)
                .Include(e => e.packageServices)
                .Include(e => e.packageTaxes)
                .FirstAsync(s => s.PackageId == package.PackageId);

            foreach (var packageProduct in package.packageProducts.ToList())
            {
                if (dbPackage.packageProducts.Count(p => p.ProductId == packageProduct.ProductId) == 0)
                {
                    dbPackage.packageProducts.Add(packageProduct);
                }
            }
            foreach (var packageProduct in dbPackage.packageProducts.ToList())
            {
                if (package.packageProducts.Count(p => p.ProductId == packageProduct.ProductId) == 0)
                {
                    dbPackage.packageProducts.Remove(packageProduct);
                }
            }
            foreach (var packageService in package.packageServices.ToList())
            {
                if (dbPackage.packageServices.Count(p => p.ServiceId == packageService.ServiceId) == 0)
                {
                    dbPackage.packageServices.Add(packageService);
                }
            }
            foreach (var packageService in dbPackage.packageServices.ToList())
            {
                if (package.packageServices.Count(p => p.ServiceId == packageService.ServiceId) == 0)
                {
                    dbPackage.packageServices.Remove(packageService);
                }
            }
            foreach (var item in package.packageTaxes.ToList())
            {
                if (dbPackage.packageTaxes.Count(p => p.TaxId == item.TaxId) == 0)
                {
                    dbPackage.packageTaxes.Add(new PackageTax { PackageId = item.PackageId, TaxId = item.TaxId });
                }
            }
            foreach (var item in dbPackage.packageTaxes.ToList())
            {
                if (package.packageTaxes.Count(p => p.TaxId == item.TaxId) == 0)
                {
                    dbPackage.packageTaxes.Remove(item);
                }
            }

            // if this doesn't work, try automapper Package properties -> dbPackage properties
            dbPackage.name = package.name;
            dbPackage.totalOfIndividualPrices = package.totalOfIndividualPrices;
            dbPackage.retailPrice = package.retailPrice;
            dbPackage.packageProductsString = package.packageProductsString;
            dbPackage.packageProducts = package.packageProducts;
            dbPackage.packageServices = package.packageServices;
            dbPackage.packageTaxes = package.packageTaxes;

            foreach (var item in dbPackage.packageProducts)
            {
                item.Product = null;
            }

            foreach (var item in dbPackage.packageServices)
            {
                item.Service = null;
            }

            foreach (var item in dbPackage.packageTaxes)
            {
                item.Tax = null;
            }

            _context.Packages.Update(dbPackage);


            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PackageExists(id))
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

        // POST: api/Packages
        [HttpPost]
        public async Task<ActionResult> PostPackage([FromBody] Package package)
        {
            _context.Packages.Add(package);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPackage", new { id = package.PackageId }, package);
        }

        // DELETE: api/Packages/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePackage([FromRoute] int id)
        {
            var package = await _context.Packages.FindAsync(id);
            if (package == null)
            {
                return Ok(null);
            }

            _context.Packages.Remove(package);
            await _context.SaveChangesAsync();

            return Ok(package);
        }

        // add product to package
        // remove product from package

        private bool PackageExists(int id)
        {
            return _context.Packages.Any(e => e.PackageId == id);
        }

        // GET: api/Packages/new
        [HttpGet("new")]
        public async Task<ActionResult> GetListsForNew()
        {
            var dto = new GetListsForNewDTO
            {
                Products = await _context.Products.ToListAsync(),
                Services = await _context.Services.ToListAsync(),
                Taxes = await _context.Taxes.ToListAsync()
            };

            return Ok(dto);
        }

        private class GetListsForNewDTO
        {
            public ICollection<Product> Products { get; set; }
            public ICollection<Service> Services { get; set; }
            public ICollection<Tax> Taxes { get; set; }
        }

        // GET: api/Packages/5/edit
        [HttpGet("{id}/edit")]
        public async Task<ActionResult> GetPackageForEdit([FromRoute] int id)
        {
            var packages = _context.Packages
                .Include(e => e.packageProducts).ThenInclude(e => e.Product)
                .Include(e => e.packageServices).ThenInclude(e => e.Service)
                .Include(e => e.packageTaxes).ThenInclude(e => e.Tax);

            var package = await packages.FirstOrDefaultAsync(e => e.PackageId == id);

            var dto = new GetPackageForEditDTO
            {
                Package = package,
                Products = await _context.Products.ToListAsync(),
                Services = await _context.Services.ToListAsync(),
                Taxes = await _context.Taxes.ToListAsync()
            };

            return Ok(dto);
        }

        private class GetPackageForEditDTO
        {
            public Package Package { get; set; }
            public ICollection<Product> Products { get; set; }
            public ICollection<Service> Services { get; set; }
            public ICollection<Tax> Taxes { get; set; }
        }
    }
}